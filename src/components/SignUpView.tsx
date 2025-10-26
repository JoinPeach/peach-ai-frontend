import * as React from 'react';

interface SignUpViewProps {
  onSignUp: (data: { name: string; email: string; password: string }) => void;
  onSwitchToLogin?: () => void;
}

function GoogleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 27 27" fill="none">
      <path d="M12.6317 0H0.00016284V12.6316H12.6317V0Z" fill="#F25022"/>
      <path d="M12.6317 14.0351H0.00016284V26.6666H12.6317V14.0351Z" fill="#00A4EF"/>
      <path d="M26.6668 0H14.0352V12.6316H26.6668V0Z" fill="#7FBA00"/>
      <path d="M26.6668 14.0351H14.0352V26.6666H26.6668V14.0351Z" fill="#FFB900"/>
    </svg>
  );
}

export function SignUpView({ onSignUp }: SignUpViewProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState<'google' | 'microsoft' | 'email' | null>(null);

  const handleGoogleSignIn = async () => {
    // Temporarily bypass OAuth and go directly to onboarding
    onSignUp({
      name: 'Puneet Thiara',
      email: 'pthiara@university.edu',
      password: 'demo'
    });
  };

  const handleOffice365SignIn = async () => {
    // Temporarily bypass OAuth and go directly to onboarding
    onSignUp({
      name: 'Puneet Thiara',
      email: 'pthiara@university.edu',
      password: 'demo'
    });
  };

  const handleEmailSignIn = () => {
    // Bypass OAuth and go directly to onboarding
    onSignUp({
      name: 'Puneet Thiara',
      email: 'pthiara@university.edu',
      password: 'demo'
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[512px]">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-[40px] text-[#333333] mb-2.5">Join schools worldwide who automate their work using Peach.</h1>
          <p className="text-[18px] text-[#333333] leading-normal hidden">
            Join schools worldwide who automate their work using Peach.
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-col gap-4 items-center mb-6">
          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-[340px] max-w-full h-[56px] bg-white border border-[#333333] rounded-[10px] flex items-center justify-center gap-3 hover:bg-[#f9f9fa] transition-colors"
          >
            <GoogleIcon />
            <span className="text-[18px] text-[#333333]">Continue with Google</span>
          </button>

          {/* Office 365 Button */}
          <button
            onClick={handleOffice365SignIn}
            className="w-[340px] max-w-full h-[56px] bg-white border border-[#333333] rounded-[10px] flex items-center justify-center gap-3 hover:bg-[#f9f9fa] transition-colors"
          >
            <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
              {/* Back envelope shape */}
              <rect x="26" y="14" width="32" height="32" rx="2" fill="#0078D4"/>
              <rect x="26" y="14" width="32" height="16" fill="#0A2767"/>
              <rect x="26" y="14" width="16" height="16" fill="#28A8EA"/>
              <rect x="42" y="14" width="16" height="16" fill="#0078D4"/>
              <rect x="26" y="30" width="16" height="16" fill="#0078D4"/>
              <rect x="42" y="30" width="16" height="16" fill="#50D9FF"/>
              
              {/* Envelope flap */}
              <path d="M26 14 L42 26 L58 14" fill="#0A2767" opacity="0.5"/>
              <path d="M26 14 L42 26 L58 14 L58 16 L42 28 L26 16 Z" fill="#1490DF"/>
              
              {/* Front O square */}
              <rect x="6" y="22" width="28" height="28" rx="3" fill="#0364B8"/>
              <circle cx="20" cy="36" r="9" fill="none" stroke="white" strokeWidth="3"/>
            </svg>
            <span className="text-[18px] text-[#333333]">Continue with Outlook</span>
          </button>

          {/* Email Button */}
          <button
            onClick={handleEmailSignIn}
            disabled={isLoading}
            className="hidden w-[340px] max-w-full h-[56px] bg-white border border-[#333333] rounded-[10px] flex items-center justify-center gap-3 hover:bg-[#f9f9fa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m2 7 10 7 10-7"/>
            </svg>
            <span className="text-[18px] text-[#333333]">Continue with Email</span>
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-[13px] text-[#202124] mt-8">
          By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
