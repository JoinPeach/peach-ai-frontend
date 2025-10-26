// Local storage utilities for data persistence
export interface AllData {
  emails: any[];
  sentItems: any[];
  campaignDrafts: any[];
  completedCampaigns: any[];
  knowledgeBase: any[];
}

const STORAGE_KEYS = {
  emails: 'peach_emails',
  sentItems: 'peach_sent_items',
  campaignDrafts: 'peach_campaign_drafts',
  completedCampaigns: 'peach_completed_campaigns',
  knowledgeBase: 'peach_knowledge_base',
};

export const loadAllData = async (userId: string): Promise<AllData> => {
  try {
    const data: AllData = {
      emails: JSON.parse(localStorage.getItem(STORAGE_KEYS.emails) || '[]'),
      sentItems: JSON.parse(localStorage.getItem(STORAGE_KEYS.sentItems) || '[]'),
      campaignDrafts: JSON.parse(localStorage.getItem(STORAGE_KEYS.campaignDrafts) || '[]'),
      completedCampaigns: JSON.parse(localStorage.getItem(STORAGE_KEYS.completedCampaigns) || '[]'),
      knowledgeBase: JSON.parse(localStorage.getItem(STORAGE_KEYS.knowledgeBase) || '[]'),
    };
    return data;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return {
      emails: [],
      sentItems: [],
      campaignDrafts: [],
      completedCampaigns: [],
      knowledgeBase: [],
    };
  }
};

export const saveEmails = async (userId: string, emails: any[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEYS.emails, JSON.stringify(emails));
  } catch (error) {
    console.error('Error saving emails to localStorage:', error);
    throw error;
  }
};

export const saveSentItems = async (userId: string, sentItems: any[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEYS.sentItems, JSON.stringify(sentItems));
  } catch (error) {
    console.error('Error saving sent items to localStorage:', error);
    throw error;
  }
};

export const saveCampaignDrafts = async (userId: string, campaignDrafts: any[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEYS.campaignDrafts, JSON.stringify(campaignDrafts));
  } catch (error) {
    console.error('Error saving campaign drafts to localStorage:', error);
    throw error;
  }
};

export const saveCompletedCampaigns = async (userId: string, completedCampaigns: any[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEYS.completedCampaigns, JSON.stringify(completedCampaigns));
  } catch (error) {
    console.error('Error saving completed campaigns to localStorage:', error);
    throw error;
  }
};

export const getKnowledgeBase = async (userId: string): Promise<any[]> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.knowledgeBase) || '[]');
  } catch (error) {
    console.error('Error loading knowledge base from localStorage:', error);
    return [];
  }
};

export const saveKnowledgeBase = async (userId: string, knowledgeBase: any[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEYS.knowledgeBase, JSON.stringify(knowledgeBase));
  } catch (error) {
    console.error('Error saving knowledge base to localStorage:', error);
    throw error;
  }
};
