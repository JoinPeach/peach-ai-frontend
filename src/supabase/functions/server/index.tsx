import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b9a90019/health", (c) => {
  return c.json({ status: "ok" });
});

// Microsoft Outlook OAuth Configuration
const MICROSOFT_CLIENT_ID = Deno.env.get("MICROSOFT_CLIENT_ID") || "placeholder-client-id";
const MICROSOFT_CLIENT_SECRET = Deno.env.get("MICROSOFT_CLIENT_SECRET") || "placeholder-client-secret";
const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/make-server-b9a90019/outlook/callback`;
const SCOPES = "openid profile email offline_access Mail.Read Mail.Send User.Read";

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "placeholder-client-id";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "placeholder-client-secret";
const GOOGLE_SIGNUP_REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/make-server-b9a90019/auth/google/callback`;
const MICROSOFT_SIGNUP_REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/make-server-b9a90019/auth/microsoft/callback`;

// Outlook OAuth - Initiate authentication
app.get("/make-server-b9a90019/outlook/auth", async (c) => {
  try {
    const userId = c.req.query("userId") || "default-user";
    const frontendUrl = c.req.query("frontendUrl") || "https://app.example.com";
    
    // Store state for verification
    const state = crypto.randomUUID();
    await kv.set(`outlook_state_${state}`, JSON.stringify({ userId, frontendUrl }));
    
    const authUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
    authUrl.searchParams.set("client_id", MICROSOFT_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("scope", SCOPES);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_mode", "query");
    
    console.log(`Initiating Outlook OAuth for user ${userId}, redirecting to: ${authUrl.toString()}`);
    
    return c.redirect(authUrl.toString());
  } catch (error) {
    console.error("Error initiating Outlook OAuth:", error);
    return c.json({ error: "Failed to initiate OAuth", details: String(error) }, 500);
  }
});

// Outlook OAuth - Handle callback
app.get("/make-server-b9a90019/outlook/callback", async (c) => {
  try {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    
    if (error) {
      console.error("OAuth error:", error);
      return c.json({ error: "OAuth failed", details: error }, 400);
    }
    
    if (!code || !state) {
      console.error("Missing code or state in OAuth callback");
      return c.json({ error: "Missing code or state" }, 400);
    }
    
    // Verify state and get user info
    const stateData = await kv.get(`outlook_state_${state}`);
    if (!stateData) {
      console.error("Invalid state parameter");
      return c.json({ error: "Invalid state" }, 400);
    }
    
    const { userId, frontendUrl } = JSON.parse(stateData);
    
    // Exchange code for tokens
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    const tokenParams = new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });
    
    console.log(`Exchanging authorization code for tokens for user ${userId}`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange failed:", errorData);
      return c.json({ error: "Token exchange failed", details: errorData }, 500);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    let userEmail = "unknown@outlook.com";
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      userEmail = profile.mail || profile.userPrincipalName || userEmail;
    }
    
    // Store tokens securely
    await kv.set(`outlook_tokens_${userId}`, JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      email: userEmail,
    }));
    
    // Clean up state
    await kv.del(`outlook_state_${state}`);
    
    console.log(`Successfully authenticated Outlook for user ${userId}, email: ${userEmail}`);
    
    // Redirect back to frontend with success
    const redirectUrl = new URL(frontendUrl);
    redirectUrl.searchParams.set("outlook_connected", "true");
    redirectUrl.searchParams.set("outlook_email", userEmail);
    
    return c.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error in Outlook OAuth callback:", error);
    return c.json({ error: "OAuth callback failed", details: String(error) }, 500);
  }
});

// Refresh Outlook access token
async function refreshOutlookToken(userId: string): Promise<string | null> {
  try {
    const tokenData = await kv.get(`outlook_tokens_${userId}`);
    if (!tokenData) {
      console.error(`No tokens found for user ${userId}`);
      return null;
    }
    
    const tokens = JSON.parse(tokenData);
    
    // If token is still valid, return it
    if (tokens.expires_at > Date.now() + 60000) {
      return tokens.access_token;
    }
    
    // Refresh the token
    console.log(`Refreshing Outlook token for user ${userId}`);
    
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    const tokenParams = new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    });
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token refresh failed:", errorData);
      return null;
    }
    
    const newTokens = await tokenResponse.json();
    
    // Update stored tokens
    await kv.set(`outlook_tokens_${userId}`, JSON.stringify({
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token || tokens.refresh_token,
      expires_at: Date.now() + (newTokens.expires_in * 1000),
      email: tokens.email,
    }));
    
    return newTokens.access_token;
  } catch (error) {
    console.error("Error refreshing Outlook token:", error);
    return null;
  }
}

// Get Outlook connection status
app.get("/make-server-b9a90019/outlook/status", async (c) => {
  try {
    const userId = c.req.query("userId") || "default-user";
    
    const tokenData = await kv.get(`outlook_tokens_${userId}`);
    if (!tokenData) {
      return c.json({ connected: false });
    }
    
    const tokens = JSON.parse(tokenData);
    return c.json({ 
      connected: true,
      email: tokens.email,
    });
  } catch (error) {
    console.error("Error checking Outlook status:", error);
    return c.json({ error: "Failed to check status", details: String(error) }, 500);
  }
});

// Fetch emails from Outlook
app.get("/make-server-b9a90019/outlook/emails", async (c) => {
  try {
    const userId = c.req.query("userId") || "default-user";
    
    // Get valid access token
    const accessToken = await refreshOutlookToken(userId);
    if (!accessToken) {
      console.error(`Failed to get access token for user ${userId}`);
      return c.json({ error: "Not authenticated or token refresh failed" }, 401);
    }
    
    console.log(`Fetching emails from Outlook for user ${userId}`);
    
    // Fetch emails from Microsoft Graph API
    const messagesResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,bodyPreview,body,isRead,hasAttachments,toRecipients",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.text();
      console.error("Failed to fetch emails from Microsoft Graph:", errorData);
      return c.json({ error: "Failed to fetch emails", details: errorData }, 500);
    }
    
    const data = await messagesResponse.json();
    
    // Transform Microsoft Graph emails to our format
    const emails = data.value.map((msg: any, index: number) => {
      const receivedDate = new Date(msg.receivedDateTime);
      const today = new Date();
      const isToday = receivedDate.toDateString() === today.toDateString();
      
      let dateStr;
      if (isToday) {
        dateStr = "Today";
      } else {
        dateStr = receivedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      const timeStr = receivedDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      const senderEmail = msg.from?.emailAddress?.address || "unknown@outlook.com";
      const senderName = msg.from?.emailAddress?.name || senderEmail.split('@')[0];
      const recipientEmail = msg.toRecipients?.[0]?.emailAddress?.address || "inbox@university.edu";
      
      return {
        id: `outlook-${msg.id}`,
        sender: senderName,
        email: senderEmail,
        subject: msg.subject || "(No Subject)",
        preview: msg.bodyPreview || "",
        date: dateStr,
        time: timeStr,
        unread: !msg.isRead,
        hasAttachment: msg.hasAttachments,
        fullMessage: msg.body?.content || msg.bodyPreview || "",
        inboxAddress: recipientEmail,
        source: "outlook",
        thread: [],
      };
    });
    
    console.log(`Successfully fetched ${emails.length} emails from Outlook for user ${userId}`);
    
    return c.json({ emails });
  } catch (error) {
    console.error("Error fetching Outlook emails:", error);
    return c.json({ error: "Failed to fetch emails", details: String(error) }, 500);
  }
});

// Disconnect Outlook
app.post("/make-server-b9a90019/outlook/disconnect", async (c) => {
  try {
    const userId = c.req.query("userId") || "default-user";
    
    await kv.del(`outlook_tokens_${userId}`);
    
    console.log(`Disconnected Outlook for user ${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Outlook:", error);
    return c.json({ error: "Failed to disconnect", details: String(error) }, 500);
  }
});

// ============================================================
// OAUTH SIGN-UP ROUTES
// ============================================================

// Google Sign-Up OAuth - Initiate authentication
app.get("/make-server-b9a90019/auth/google", async (c) => {
  try {
    const frontendUrl = c.req.query("frontendUrl") || "https://app.example.com";
    
    // Store state for verification
    const state = crypto.randomUUID();
    await kv.set(`google_signup_state_${state}`, JSON.stringify({ frontendUrl }));
    
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", GOOGLE_SIGNUP_REDIRECT_URI);
    authUrl.searchParams.set("scope", "openid profile email");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    
    console.log(`Initiating Google sign-up OAuth, redirecting to: ${authUrl.toString()}`);
    
    return c.redirect(authUrl.toString());
  } catch (error) {
    console.error("Error initiating Google sign-up OAuth:", error);
    return c.json({ error: "Failed to initiate OAuth", details: String(error) }, 500);
  }
});

// Google Sign-Up OAuth - Handle callback
app.get("/make-server-b9a90019/auth/google/callback", async (c) => {
  try {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    
    if (error) {
      console.error("Google OAuth error:", error);
      return c.json({ error: "OAuth failed", details: error }, 400);
    }
    
    if (!code || !state) {
      console.error("Missing code or state in Google OAuth callback");
      return c.json({ error: "Missing code or state" }, 400);
    }
    
    // Verify state and get frontend URL
    const stateData = await kv.get(`google_signup_state_${state}`);
    if (!stateData) {
      console.error("Invalid state parameter");
      return c.json({ error: "Invalid state" }, 400);
    }
    
    const { frontendUrl } = JSON.parse(stateData);
    
    // Exchange code for tokens
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const tokenParams = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    
    console.log(`Exchanging Google authorization code for tokens`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Google token exchange failed:", errorData);
      return c.json({ error: "Token exchange failed", details: errorData }, 500);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error("Failed to fetch Google user profile:", errorData);
      return c.json({ error: "Failed to fetch user profile", details: errorData }, 500);
    }
    
    const profile = await profileResponse.json();
    
    // Create user account
    const userId = crypto.randomUUID();
    const sessionToken = crypto.randomUUID();
    
    await kv.set(`user_${userId}`, JSON.stringify({
      id: userId,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      provider: "google",
      createdAt: Date.now(),
    }));
    
    await kv.set(`session_${sessionToken}`, JSON.stringify({
      userId,
      createdAt: Date.now(),
    }));
    
    // Clean up state
    await kv.del(`google_signup_state_${state}`);
    
    console.log(`Successfully created user account via Google: ${profile.email}`);
    
    // Redirect back to frontend with session
    const redirectUrl = new URL(frontendUrl);
    redirectUrl.searchParams.set("session", sessionToken);
    redirectUrl.searchParams.set("name", profile.name);
    redirectUrl.searchParams.set("email", profile.email);
    
    return c.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error in Google sign-up OAuth callback:", error);
    return c.json({ error: "OAuth callback failed", details: String(error) }, 500);
  }
});

// Microsoft Sign-Up OAuth - Initiate authentication
app.get("/make-server-b9a90019/auth/microsoft", async (c) => {
  try {
    const frontendUrl = c.req.query("frontendUrl") || "https://app.example.com";
    
    // Store state for verification
    const state = crypto.randomUUID();
    await kv.set(`microsoft_signup_state_${state}`, JSON.stringify({ frontendUrl }));
    
    const authUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
    authUrl.searchParams.set("client_id", MICROSOFT_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", MICROSOFT_SIGNUP_REDIRECT_URI);
    authUrl.searchParams.set("scope", "openid profile email User.Read");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_mode", "query");
    
    console.log(`Initiating Microsoft sign-up OAuth, redirecting to: ${authUrl.toString()}`);
    
    return c.redirect(authUrl.toString());
  } catch (error) {
    console.error("Error initiating Microsoft sign-up OAuth:", error);
    return c.json({ error: "Failed to initiate OAuth", details: String(error) }, 500);
  }
});

// Microsoft Sign-Up OAuth - Handle callback
app.get("/make-server-b9a90019/auth/microsoft/callback", async (c) => {
  try {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    
    if (error) {
      console.error("Microsoft OAuth error:", error);
      return c.json({ error: "OAuth failed", details: error }, 400);
    }
    
    if (!code || !state) {
      console.error("Missing code or state in Microsoft OAuth callback");
      return c.json({ error: "Missing code or state" }, 400);
    }
    
    // Verify state and get frontend URL
    const stateData = await kv.get(`microsoft_signup_state_${state}`);
    if (!stateData) {
      console.error("Invalid state parameter");
      return c.json({ error: "Invalid state" }, 400);
    }
    
    const { frontendUrl } = JSON.parse(stateData);
    
    // Exchange code for tokens
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    const tokenParams = new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
      code: code,
      redirect_uri: MICROSOFT_SIGNUP_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    
    console.log(`Exchanging Microsoft authorization code for tokens`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Microsoft token exchange failed:", errorData);
      return c.json({ error: "Token exchange failed", details: errorData }, 500);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error("Failed to fetch Microsoft user profile:", errorData);
      return c.json({ error: "Failed to fetch user profile", details: errorData }, 500);
    }
    
    const profile = await profileResponse.json();
    
    // Create user account
    const userId = crypto.randomUUID();
    const sessionToken = crypto.randomUUID();
    
    await kv.set(`user_${userId}`, JSON.stringify({
      id: userId,
      name: profile.displayName,
      email: profile.mail || profile.userPrincipalName,
      provider: "microsoft",
      createdAt: Date.now(),
    }));
    
    await kv.set(`session_${sessionToken}`, JSON.stringify({
      userId,
      createdAt: Date.now(),
    }));
    
    // Clean up state
    await kv.del(`microsoft_signup_state_${state}`);
    
    console.log(`Successfully created user account via Microsoft: ${profile.mail || profile.userPrincipalName}`);
    
    // Redirect back to frontend with session
    const redirectUrl = new URL(frontendUrl);
    redirectUrl.searchParams.set("session", sessionToken);
    redirectUrl.searchParams.set("name", profile.displayName);
    redirectUrl.searchParams.set("email", profile.mail || profile.userPrincipalName);
    
    return c.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error in Microsoft sign-up OAuth callback:", error);
    return c.json({ error: "OAuth callback failed", details: String(error) }, 500);
  }
});

// Verify session endpoint
app.get("/make-server-b9a90019/auth/verify", async (c) => {
  try {
    const sessionToken = c.req.query("session");
    
    if (!sessionToken) {
      return c.json({ valid: false, error: "No session token provided" }, 400);
    }
    
    const sessionData = await kv.get(`session_${sessionToken}`);
    if (!sessionData) {
      return c.json({ valid: false, error: "Invalid session" }, 401);
    }
    
    const session = JSON.parse(sessionData);
    const userData = await kv.get(`user_${session.userId}`);
    
    if (!userData) {
      return c.json({ valid: false, error: "User not found" }, 404);
    }
    
    const user = JSON.parse(userData);
    
    return c.json({ 
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
      }
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return c.json({ error: "Failed to verify session", details: String(error) }, 500);
  }
});

// ============================================================
// AI EMAIL GENERATION ROUTE - REMOVED
// Using template responses in frontend only
// ============================================================

// DATA PERSISTENCE ROUTES
// ============================================================

// User Profile Routes
app.get("/make-server-b9a90019/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userData = await kv.get(`user_profile_${userId}`);
    
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json(JSON.parse(userData));
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userData = await c.req.json();
    
    await kv.set(`user_profile_${userId}`, JSON.stringify(userData));
    console.log(`Saved user profile for: ${userId}`);
    
    return c.json({ success: true, userId });
  } catch (error) {
    console.error("Error saving user:", error);
    return c.json({ error: "Failed to save user", details: String(error) }, 500);
  }
});

// Email Routes
app.get("/make-server-b9a90019/emails/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const emailsData = await kv.get(`emails_${userId}`);
    
    if (!emailsData) {
      return c.json({ emails: [] });
    }
    
    return c.json(JSON.parse(emailsData));
  } catch (error) {
    console.error("Error fetching emails:", error);
    return c.json({ error: "Failed to fetch emails", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/emails/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const emailsData = await c.req.json();
    
    await kv.set(`emails_${userId}`, JSON.stringify(emailsData));
    console.log(`Saved emails for user: ${userId}`);
    
    return c.json({ success: true, count: emailsData.emails?.length || 0 });
  } catch (error) {
    console.error("Error saving emails:", error);
    return c.json({ error: "Failed to save emails", details: String(error) }, 500);
  }
});

// Individual Email Operations
app.post("/make-server-b9a90019/email/:userId/:emailId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const emailId = c.req.param("emailId");
    const emailData = await c.req.json();
    
    await kv.set(`email_${userId}_${emailId}`, JSON.stringify(emailData));
    console.log(`Saved individual email: ${emailId} for user: ${userId}`);
    
    return c.json({ success: true, emailId });
  } catch (error) {
    console.error("Error saving email:", error);
    return c.json({ error: "Failed to save email", details: String(error) }, 500);
  }
});

app.delete("/make-server-b9a90019/email/:userId/:emailId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const emailId = c.req.param("emailId");
    
    await kv.del(`email_${userId}_${emailId}`);
    console.log(`Deleted email: ${emailId} for user: ${userId}`);
    
    return c.json({ success: true, emailId });
  } catch (error) {
    console.error("Error deleting email:", error);
    return c.json({ error: "Failed to delete email", details: String(error) }, 500);
  }
});

// Sent Items Routes
app.get("/make-server-b9a90019/sent/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const sentData = await kv.get(`sent_items_${userId}`);
    
    if (!sentData) {
      return c.json({ sentItems: [] });
    }
    
    return c.json(JSON.parse(sentData));
  } catch (error) {
    console.error("Error fetching sent items:", error);
    return c.json({ error: "Failed to fetch sent items", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/sent/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const sentData = await c.req.json();
    
    await kv.set(`sent_items_${userId}`, JSON.stringify(sentData));
    console.log(`Saved sent items for user: ${userId}`);
    
    return c.json({ success: true, count: sentData.sentItems?.length || 0 });
  } catch (error) {
    console.error("Error saving sent items:", error);
    return c.json({ error: "Failed to save sent items", details: String(error) }, 500);
  }
});

// Campaign Routes
app.get("/make-server-b9a90019/campaigns/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const draftsData = await kv.get(`campaign_drafts_${userId}`);
    const completedData = await kv.get(`campaign_completed_${userId}`);
    
    return c.json({
      drafts: draftsData ? JSON.parse(draftsData) : [],
      completed: completedData ? JSON.parse(completedData) : []
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return c.json({ error: "Failed to fetch campaigns", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/campaigns/:userId/drafts", async (c) => {
  try {
    const userId = c.req.param("userId");
    const draftsData = await c.req.json();
    
    await kv.set(`campaign_drafts_${userId}`, JSON.stringify(draftsData));
    console.log(`Saved campaign drafts for user: ${userId}`);
    
    return c.json({ success: true, count: draftsData.length });
  } catch (error) {
    console.error("Error saving campaign drafts:", error);
    return c.json({ error: "Failed to save campaign drafts", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/campaigns/:userId/completed", async (c) => {
  try {
    const userId = c.req.param("userId");
    const completedData = await c.req.json();
    
    await kv.set(`campaign_completed_${userId}`, JSON.stringify(completedData));
    console.log(`Saved completed campaigns for user: ${userId}`);
    
    return c.json({ success: true, count: completedData.length });
  } catch (error) {
    console.error("Error saving completed campaigns:", error);
    return c.json({ error: "Failed to save completed campaigns", details: String(error) }, 500);
  }
});

// Knowledge Base Routes
app.get("/make-server-b9a90019/knowledge-base/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const kbData = await kv.get(`knowledge_base_${userId}`);
    
    if (!kbData) {
      return c.json({ documents: [] });
    }
    
    return c.json(JSON.parse(kbData));
  } catch (error) {
    console.error("Error fetching knowledge base:", error);
    return c.json({ error: "Failed to fetch knowledge base", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/knowledge-base/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const kbData = await c.req.json();
    
    await kv.set(`knowledge_base_${userId}`, JSON.stringify(kbData));
    console.log(`Saved knowledge base for user: ${userId} with ${kbData.documents?.length || 0} documents`);
    
    return c.json({ success: true, count: kbData.documents?.length || 0 });
  } catch (error) {
    console.error("Error saving knowledge base:", error);
    return c.json({ error: "Failed to save knowledge base", details: String(error) }, 500);
  }
});

// Settings Routes
app.get("/make-server-b9a90019/settings/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const settingsData = await kv.get(`settings_${userId}`);
    
    if (!settingsData) {
      return c.json({ 
        settings: {
          profile: {},
          emailIntegrations: {},
          team: [],
          billing: {}
        }
      });
    }
    
    return c.json(JSON.parse(settingsData));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return c.json({ error: "Failed to fetch settings", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/settings/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const settingsData = await c.req.json();
    
    await kv.set(`settings_${userId}`, JSON.stringify(settingsData));
    console.log(`Saved settings for user: ${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return c.json({ error: "Failed to save settings", details: String(error) }, 500);
  }
});

// Analytics Routes
app.get("/make-server-b9a90019/analytics/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const analyticsData = await kv.get(`analytics_${userId}`);
    
    if (!analyticsData) {
      return c.json({ 
        analytics: {
          emailsReceived: 0,
          emailsSent: 0,
          campaignsSent: 0,
          avgResponseTime: 0,
          dailyStats: []
        }
      });
    }
    
    return c.json(JSON.parse(analyticsData));
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return c.json({ error: "Failed to fetch analytics", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/analytics/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const analyticsData = await c.req.json();
    
    await kv.set(`analytics_${userId}`, JSON.stringify(analyticsData));
    console.log(`Saved analytics for user: ${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving analytics:", error);
    return c.json({ error: "Failed to save analytics", details: String(error) }, 500);
  }
});

// Onboarding State Routes
app.get("/make-server-b9a90019/onboarding/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const onboardingData = await kv.get(`onboarding_${userId}`);
    
    if (!onboardingData) {
      return c.json({ completed: false });
    }
    
    return c.json(JSON.parse(onboardingData));
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return c.json({ error: "Failed to fetch onboarding status", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/onboarding/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const onboardingData = await c.req.json();
    
    await kv.set(`onboarding_${userId}`, JSON.stringify(onboardingData));
    console.log(`Saved onboarding status for: ${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving onboarding status:", error);
    return c.json({ error: "Failed to save onboarding status", details: String(error) }, 500);
  }
});

// Onboarding State Routes
app.get("/make-server-b9a90019/onboarding/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const onboardingData = await kv.get(`onboarding_${userId}`);
    
    if (!onboardingData) {
      return c.json({ completed: false });
    }
    
    return c.json(JSON.parse(onboardingData));
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return c.json({ error: "Failed to fetch onboarding status", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/onboarding/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const onboardingData = await c.req.json();
    
    await kv.set(`onboarding_${userId}`, JSON.stringify(onboardingData));
    console.log(`Saved onboarding status for user: ${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving onboarding status:", error);
    return c.json({ error: "Failed to save onboarding status", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch); "Email Thread History:\n\n";
    emailThread.forEach((msg: any) => {
      threadContext += `From: ${msg.sender} (${msg.email})\n`;
      threadContext += `Date: ${msg.date} ${msg.time}\n`;
      threadContext += `Message: ${msg.message}\n\n`;
    });
    
    // Build knowledge base context
    let kbContext = "";
    if (knowledgeBase && Array.isArray(knowledgeBase) && knowledgeBase.length > 0) {
      kbContext = "\n\nKnowledge Base Information:\n\n";
      knowledgeBase.forEach((doc: any) => {
        kbContext += `- ${doc.name}: ${doc.content || 'No content available'}\n`;
      });
    }
    
    // Build system prompt
    const systemPrompt = `You are a helpful and professional financial aid advisor responding to student inquiries. 

Your role:
- Provide accurate, helpful responses to financial aid questions
- Be empathetic and supportive
- Use clear, professional language
- Reference relevant policies and procedures from the knowledge base when applicable
- Always include contact information at the end of your response

Contact Information:
UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed

Generate a professional email response based on the email thread and knowledge base provided.`;

    const userPrompt = `${threadContext}${kbContext}\n\nGenerate a professional response to the most recent email in this thread from ${senderName}. The response should address their question or concern directly, be helpful and empathetic, and include relevant information from the knowledge base if applicable.`;
    
    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [

      return c.json({ completed: false });
    }
    
    return c.json(JSON.parse(onboardingData));
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return c.json({ error: "Failed to fetch onboarding status", details: String(error) }, 500);
  }
});

app.post("/make-server-b9a90019/onboarding/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const onboardingData = await c.req.json();
    
    await kv.set(`onboarding_${userId}`, JSON.stringify(onboardingData));
    console.log(`Saved onboarding status for user: ${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving onboarding status:", error);
    return c.json({ error: "Failed to save onboarding status", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);