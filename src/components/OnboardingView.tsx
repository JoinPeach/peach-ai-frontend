import { useState, useRef, useEffect } from 'react';
import { Check, ArrowRight, ArrowLeft, Sparkles, Mail, BookOpen, Users, X, FileText } from 'lucide-react';

interface OnboardingViewProps {
  userName: string;
  onComplete: (uploadedFiles?: File[], navigateTo?: 'home' | 'inbox') => void;
  onCancel: () => void;
}

export function OnboardingView({ userName, onComplete, onCancel }: OnboardingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState('');
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [outlookEmail, setOutlookEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email integration removed - using local state only

  const steps = [
    {
      title: 'Welcome to FinAid AI',
      subtitle: `Hi ${userName}! Let's get you set up in just a few steps.`,
      icon: Sparkles,
    },
    {
      title: 'What\'s your role?',
      subtitle: 'This helps us personalize your experience',
      icon: Users,
    },
    {
      title: 'Connect your email',
      subtitle: 'We\'ll help you respond to student emails faster',
      icon: Mail,
    },
    {
      title: 'Build your knowledge base',
      subtitle: 'Upload documents to train your AI assistant',
      icon: BookOpen,
    },
  ];

  const roles = [
    { id: 'director', label: 'Financial Aid Director', description: 'Oversee the entire department' },
    { id: 'counselor', label: 'Financial Aid Counselor', description: 'Work directly with students' },
    { id: 'admin', label: 'Administrative Staff', description: 'Support operations and processes' },
    { id: 'other', label: 'Other', description: 'Different role in financial aid' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(uploadedFiles, 'home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleGmailConnect = () => {
    // Simulate OAuth flow
    // In a real app, this would redirect to Google OAuth
    const simulatedEmail = 'finaid@university.edu';
    setGmailEmail(simulatedEmail);
    setIsGmailConnected(true);
  };

  const handleOutlookConnect = () => {
    // Simulate OAuth flow
    // In a real app, this would redirect to Microsoft OAuth
    const simulatedEmail = 'finaid@university.edu';
    setOutlookEmail(simulatedEmail);
    setIsOutlookConnected(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center py-16 px-16">
            <h1 className="text-4xl mb-10 text-left max-w-md mx-auto">Let's get you started</h1>
            <p className="text-xl text-[#7f7f7f] mb-8 max-w-md mx-auto hidden">
              Hi {userName}! Let's get you set up in just a few steps.
            </p>
            <div className="space-y-4 max-w-md mx-auto text-left mt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#cdf4d4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#011f5b]" />
                </div>
                <div>
                  <p className="text-[#1e1919]">Respond to student emails 10x faster</p>
                  <p className="text-sm text-[#7f7f7f]">AI-generated responses based on your knowledge</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#cdf4d4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#011f5b]" />
                </div>
                <div>
                  <p className="text-[#1e1919]">Send personalized mass campaigns</p>
                  <p className="text-sm text-[#7f7f7f]">Reach students at scale with AI personalization</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#cdf4d4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#011f5b]" />
                </div>
                <div>
                  <p className="text-[#1e1919]">Track analytics and team performance</p>
                  <p className="text-sm text-[#7f7f7f]">Insights to improve your operations</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="py-8">
            <div className="text-center mb-8">

              <h2 className="text-3xl mb-2">What's your role?</h2>
              <p className="text-[#7f7f7f]">This helps us personalize your experience</p>
            </div>
            <div className="space-y-3 max-w-lg mx-auto">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="w-full flex items-center gap-4 p-4 border border-[#e7e7e7] rounded-xl hover:border-[#3c4043] transition-colors text-left"
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {selectedRole === role.id ? (
                      <div className="w-5 h-5 rounded-full border-[6px] border-[#2e2c34]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#7f7f7f]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#212121]">{role.label}</div>
                    <div className="text-sm text-[#7f7f7f]">{role.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="py-8">
            <div className="text-center mb-8">

              <h2 className="text-3xl mb-2">Connect your shared inboxes</h2>
              <p className="text-[#7f7f7f]">We'll help you respond to student emails faster</p>
            </div>
            <div className="max-w-lg mx-auto space-y-4">
              <button 
                onClick={handleGmailConnect}
                disabled={isGmailConnected}
                className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  isGmailConnected 
                    ? 'border-[#FFA88B] bg-[#FFA88B]/5' 
                    : 'border-[#e7e7e7] hover:border-[#011f5b]/30'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f9f9fa] flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="text-[#1e1919]">
                    {isGmailConnected ? 'Gmail Connected' : 'Connect Gmail'}
                  </p>
                  <p className="text-sm text-[#7f7f7f]">
                    {isGmailConnected ? gmailEmail : 'Use your Google Workspace account'}
                  </p>
                </div>
                {isGmailConnected ? (
                  <Check className="w-5 h-5 text-[#FFA88B]" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-[#7f7f7f]" />
                )}
              </button>

              <button 
                onClick={handleOutlookConnect}
                disabled={isOutlookConnected}
                className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  isOutlookConnected 
                    ? 'border-[#FFA88B] bg-[#FFA88B]/5' 
                    : 'border-[#e7e7e7] hover:border-[#011f5b]/30'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f9f9fa] flex items-center justify-center">
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
                </div>
                <div className="text-left flex-1">
                  <p className="text-[#1e1919]">
                    {isOutlookConnected ? 'Outlook Connected' : 'Connect Outlook'}
                  </p>
                  <p className="text-sm text-[#7f7f7f]">
                    {isOutlookConnected ? outlookEmail : 'Use your Microsoft 365 account'}
                  </p>
                </div>
                {isOutlookConnected ? (
                  <Check className="w-5 h-5 text-[#FFA88B]" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-[#7f7f7f]" />
                )}
              </button>

              <p className="text-center text-sm text-[#7f7f7f] mt-6">
                You can configure this later in Settings
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="py-8">
            <div className="text-center mb-8">

              <h2 className="text-3xl mb-2">Build your knowledge base</h2>
              <p className="text-[#7f7f7f]">Upload documents to train your AI assistant</p>
            </div>
            <div className="max-w-lg mx-auto">
              <div className="border-2 border-dashed border-[#e7e7e7] rounded-2xl p-12 text-center hover:border-[#011f5b]/30 transition-all cursor-pointer">

                <p className="text-[#1e1919] mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-[#7f7f7f] mb-4">
                  Upload PDFs, Word docs, or text files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-[#3c4043] text-white rounded-xl hover:bg-[#2c2e31] transition-colors"
                >
                  Choose Files
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-[#7f7f7f] mb-3">Uploaded files ({uploadedFiles.length}):</p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#f9f9fa] rounded-xl border border-[#e7e7e7]"
                    >
                      <FileText className="w-5 h-5 text-[#011f5b] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1e1919] truncate">{file.name}</p>
                        <p className="text-xs text-[#7f7f7f]">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 hover:bg-[#e7e7e7] rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-[#7f7f7f]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-3">
                <p className="text-sm text-[#7f7f7f]">Suggested documents:</p>
                <ul className="space-y-2 text-sm text-[#7f7f7f]">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffa88b]"></div>
                    FAFSA guidelines and procedures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffa88b]"></div>
                    Scholarship and grant information
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffa88b]"></div>
                    Financial aid policies and deadlines
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffa88b]"></div>
                    Common Q&A responses
                  </li>
                </ul>
              </div>

              <p className="text-center text-sm text-[#7f7f7f] mt-8">
                You can add more documents later in Knowledge Base
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9fa] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-[900px]">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleSkip}
              className="text-sm text-[#7f7f7f] hover:text-[#011f5b] transition-colors hidden"
            >
              Skip for now
            </button>
          </div>
          <div className="h-2 bg-[#e7e7e7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFA88B] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#e7e7e7] rounded-3xl p-8 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex-1">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-[#e7e7e7] mt-8">
            <button
              onClick={currentStep === 0 ? onCancel : handleBack}
              className="px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-[#1e1919] hover:bg-[#f9f9fa]"
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedRole}
              className={`px-8 py-3 rounded-xl transition-colors ${
                currentStep === 1 && !selectedRole
                  ? 'bg-[#e7e7e7] text-[#7f7f7f] cursor-not-allowed'
                  : 'bg-[#3c4043] text-white hover:bg-[#2c2e31]'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
