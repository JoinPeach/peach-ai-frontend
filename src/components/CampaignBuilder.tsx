import { useState } from 'react';
import { ChevronLeft, Edit } from 'lucide-react';
import { AddRecipientsModal } from './AddRecipientsModal';
import { SubjectModal } from './SubjectModal';
import { AIGeneratorModal } from './AIGeneratorModal';
import { GeneratedEmailDisplay } from './GeneratedEmailDisplay';
import { CampaignNameModal } from './CampaignNameModal';
import { SenderEmailModal } from './SenderEmailModal';

export interface CampaignDraft {
  id: string;
  name: string;
  recipients: string[];
  subject: string;
  hasGeneratedEmail: boolean;
  created: string;
  createdBy: string;
  emailContent?: string;
  attachments?: string[];
}

interface CampaignBuilderProps {
  campaignName: string;
  onBack: () => void;
  onSaveDraft?: (draft: CampaignDraft) => void;
  onCompleteCampaign?: (draft: CampaignDraft, emailContent: string, attachments: string[]) => void;
  draftData?: Partial<CampaignDraft>;
}

export function CampaignBuilder({ campaignName, onBack, onSaveDraft, onCompleteCampaign, draftData }: CampaignBuilderProps) {
  const [currentName, setCurrentName] = useState(draftData?.name || campaignName);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSenderModal, setShowSenderModal] = useState(false);
  const [recipients, setRecipients] = useState<string[]>(draftData?.recipients || []);
  const [subject, setSubject] = useState(draftData?.subject || '');
  const [hasGeneratedEmail, setHasGeneratedEmail] = useState(draftData?.hasGeneratedEmail || false);
  const [emailContent, setEmailContent] = useState(draftData?.emailContent || '');
  const [attachments, setAttachments] = useState<string[]>(draftData?.attachments || []);
  const [campaignDescription, setCampaignDescription] = useState('');
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [senderEmail, setSenderEmail] = useState<{ name: string; email: string }>({
    name: 'Puneet Thiara',
    email: 'pthiara@university.edu'
  });

  const senderComplete = true;
  const recipientsComplete = recipients.length > 0;
  const subjectComplete = subject.trim().length > 0;
  const emailComplete = hasGeneratedEmail;

  const canSave = recipientsComplete || subjectComplete || emailComplete;
  const canSend = senderComplete && recipientsComplete && subjectComplete && emailComplete;

  const handleSaveRecipients = (newRecipients: string[]) => {
    setRecipients(newRecipients);
    setShowRecipientsModal(false);
  };

  const handleSaveSubject = (newSubject: string) => {
    setSubject(newSubject);
    setShowSubjectModal(false);
  };

  const handleAIComplete = (content: string, files: string[], description: string, tones: string[]) => {
    setHasGeneratedEmail(true);
    setEmailContent(content);
    setAttachments(files);
    setCampaignDescription(description);
    setSelectedTones(tones);
    setShowAIModal(false);
  };

  const handleUpdateName = (newName: string) => {
    setCurrentName(newName);
    setShowNameModal(false);
  };

  const handleSaveSender = (sender: { name: string; email: string }) => {
    setSenderEmail(sender);
    setShowSenderModal(false);
  };

  const handleSave = () => {
    if (onSaveDraft) {
      const draft: CampaignDraft = {
        id: draftData?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: currentName,
        recipients,
        subject,
        hasGeneratedEmail,
        created: draftData?.created || new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
        createdBy: draftData?.createdBy || 'Puneet Thiara',
      };
      onSaveDraft(draft);
    }
  };

  const handleSendCampaign = () => {
    if (onCompleteCampaign && canSend) {
      const draft: CampaignDraft = {
        id: draftData?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: currentName,
        recipients,
        subject,
        hasGeneratedEmail,
        created: draftData?.created || new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
        createdBy: draftData?.createdBy || 'Puneet Thiara',
        emailContent,
        attachments,
      };
      onCompleteCampaign(draft, emailContent, attachments);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-[769px] mx-auto w-full space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-[#666666]" />
            </button>
            <h1 className="text-lg lg:text-2xl text-[#212121] truncate">{currentName}</h1>
            <button onClick={() => setShowNameModal(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Edit className="w-5 h-5 lg:w-6 lg:h-6 text-[#666666]" />
            </button>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 lg:flex-none px-6 lg:px-10 py-2.5 lg:py-3.5 border border-[#3c4043] rounded-lg transition-colors disabled:border-[rgba(60,64,67,0.2)] disabled:text-[rgba(60,64,67,0.2)] disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Save
            </button>
            <button
              onClick={handleSendCampaign}
              disabled={!canSend}
              className="flex-1 lg:flex-none px-6 lg:px-10 py-2.5 lg:py-3.5 bg-[#3c4043] text-white rounded-lg transition-colors disabled:bg-[rgba(60,64,67,0.2)] disabled:cursor-not-allowed hover:bg-[#2c2e31] whitespace-nowrap"
            >
              Send campaign
            </button>
          </div>
        </div>

        {/* Campaign Steps */}
        <div className="bg-white border border-[#c4c4c4] rounded-lg shadow-sm divide-y divide-black/10">
          {/* Sender */}
          <div className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                  {senderComplete ? (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.4875 25 5 20.5125 5 15C5 9.4875 9.4875 5 15 5C20.5125 5 25 9.4875 25 15C25 20.5125 20.5125 25 15 25ZM20.7375 9.475L12.5 17.7125L9.2625 14.4875L7.5 16.25L12.5 21.25L22.5 11.25L20.7375 9.475Z" fill="#14BA6D"/>
                    </svg>
                  ) : (
                    <div className="w-full h-full border-2 border-[#666666] rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-[30px] mb-1">Sender</h3>
                  <p className="text-[#7f7f7f]">{senderEmail.name}</p>
                  <p className="text-[#7f7f7f]">{senderEmail.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSenderModal(true)}
                className="px-10 py-3.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage sender
              </button>
            </div>
          </div>

          {/* Recipients */}
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                  {recipientsComplete ? (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.4875 25 5 20.5125 5 15C5 9.4875 9.4875 5 15 5C20.5125 5 25 9.4875 25 15C25 20.5125 20.5125 25 15 25ZM20.7375 9.475L12.5 17.7125L9.2625 14.4875L7.5 16.25L12.5 21.25L22.5 11.25L20.7375 9.475Z" fill="#14BA6D"/>
                    </svg>
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525 25 15 25Z" fill="#666666"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-[30px] mb-1">Recipients</h3>
                  <p className="text-[#7f7f7f]">
                    {recipients.length > 0 
                      ? `${recipients.length} students selected`
                      : 'Upload a list of recipients for this campaign'
                    }
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowRecipientsModal(true)}
                className="px-10 py-3.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {recipients.length > 0 ? 'Manage recipients' : 'Add recipients'}
              </button>
            </div>
          </div>

          {/* Subject */}
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                  {subjectComplete ? (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.4875 25 5 20.5125 5 15C5 9.4875 9.4875 5 15 5C20.5125 5 25 9.4875 25 15C25 20.5125 20.5125 25 15 25ZM20.7375 9.475L12.5 17.7125L9.2625 14.4875L7.5 16.25L12.5 21.25L22.5 11.25L20.7375 9.475Z" fill="#14BA6D"/>
                    </svg>
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525 25 15 25Z" fill="#666666"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-[30px] mb-1">Subject</h3>
                  <p className="text-[#7f7f7f]">
                    {subject || 'Add a subject line for this campaign'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSubjectModal(true)}
                className="px-10 py-3.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {subject ? 'Edit subject' : 'Add subject'}
              </button>
            </div>
          </div>

          {/* AI Email Generator */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                  {emailComplete ? (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.4875 25 5 20.5125 5 15C5 9.4875 9.4875 5 15 5C20.5125 5 25 9.4875 25 15C25 20.5125 20.5125 25 15 25ZM20.7375 9.475L12.5 17.7125L9.2625 14.4875L7.5 16.25L12.5 21.25L22.5 11.25L20.7375 9.475Z" fill="#14BA6D"/>
                    </svg>
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                      <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525 25 15 25Z" fill="#666666"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-[30px] mb-1">Email</h3>
                  <p className="text-[#7f7f7f]">Create your email content with AI</p>
                </div>
              </div>
              {!emailComplete && (
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="px-10 py-3.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Use AI
                </button>
              )}
              {emailComplete && (
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="px-10 py-3.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit email
                </button>
              )}
            </div>

            {/* Generated Email Display */}
            {emailComplete && (
              <GeneratedEmailDisplay 
                onContentChange={(content, files) => {
                  setEmailContent(content);
                  setAttachments(files);
                }}
                campaignDescription={campaignDescription}
                selectedTones={selectedTones}
                onOpenGenerator={() => setShowAIModal(true)}
                initialContent={emailContent}
                initialAttachments={attachments}
              />
            )}
          </div>
        </div>
      </div>

      {showRecipientsModal && (
        <AddRecipientsModal 
          onClose={() => setShowRecipientsModal(false)}
          onSave={handleSaveRecipients}
          initialRecipients={recipients}
        />
      )}

      {showSubjectModal && (
        <SubjectModal 
          onClose={() => setShowSubjectModal(false)}
          onSave={handleSaveSubject}
          initialSubject={subject}
        />
      )}

      {showAIModal && (
        <AIGeneratorModal 
          onClose={() => setShowAIModal(false)}
          onComplete={handleAIComplete}
          initialStep={emailComplete ? 3 : 0}
          initialCampaignDescription={campaignDescription}
          initialSelectedTones={selectedTones}
          initialAttachments={attachments}
          initialEmailContent={emailContent}
          campaignName={currentName}
        />
      )}

      {showNameModal && (
        <CampaignNameModal 
          onClose={() => setShowNameModal(false)}
          onSubmit={handleUpdateName}
          initialName={currentName}
          isEditing={true}
        />
      )}

      {showSenderModal && (
        <SenderEmailModal 
          onClose={() => setShowSenderModal(false)}
          onSave={handleSaveSender}
          initialSender={senderEmail}
        />
      )}
    </div>
  );
}