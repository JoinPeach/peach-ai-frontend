import { useState, useRef } from 'react';
import { Edit, Upload, X } from 'lucide-react';
import svgPaths from '../imports/svg-19oc694uq7';

interface AIGeneratorModalProps {
  onClose: () => void;
  onComplete: (content: string, attachments: string[], description: string, tones: string[]) => void;
  initialStep?: number;
  initialCampaignDescription?: string;
  initialSelectedTones?: string[];
  initialAttachments?: string[];
  initialEmailContent?: string;
  campaignName?: string;
}

const emailVariations = [
  // Variation 1 - FAFSA Confirmation
  `Hello,

Thank you for submitting your FAFSA and listing the University of Pennsylvania. We can confirm that your FAFSA has been received via SFS's secure portal.

Here are your next steps:

• Review your checklist on Path@UPenn: Log in to Path@UPenn to view your financial aid checklist and award status.
• Submit any outstanding documents: If additional information (e.g. tax transcripts, verification forms) is required, upload those promptly through our secure document portal.
• Await your award notice: Once your file is complete and reviewed, your financial aid award letter will be posted on Path@UPenn. This package typically meets 100% of demonstrated need via grants and work-study.

Please check Path@UPenn regularly, and don't hesitate to reach out with any questions—we're here to help!

Warm regards,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

  // Variation 2 - Document Request
  `Dear Student,

We're reviewing your financial aid application and need a few additional documents to complete your file:

Required documents:
1. 2024 Tax Transcripts for you and your parents
2. W-2 forms for all household members
3. Verification worksheet (download from Path@UPenn)

How to submit:
→ Log in to Path@UPenn
→ Navigate to your Financial Aid Checklist
→ Upload documents through the secure portal

Timeline: Please submit within 14 days to avoid delays. We typically process documents within 5-7 business days.

If you have questions or need assistance obtaining any documents, please contact our office during business hours.

Best regards,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

  // Variation 3 - Verification Process
  `Dear Student,

Your FAFSA has been selected for verification—this is a standard quality control process required by the Department of Education.

To complete verification:

Step 1: Download the Verification Worksheet from your Path@UPenn portal
Step 2: Complete all sections and obtain required signatures
Step 3: Submit your IRS Tax Transcript (or use the IRS Data Retrieval Tool)
Step 4: Upload all documents through our secure portal

Deadline: Please submit within 2 weeks to ensure timely processing of your financial aid package.

Most students complete verification within 7-10 business days. Once verified, we'll finalize your award and notify you immediately.

Questions? We're here to help guide you through the process.

Sincerely,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

  // Variation 4 - Award Notification
  `Dear Student,

Great news! Your financial aid package is now available on Path@UPenn.

Your package includes:
• Penn Grant: Meeting 100% of demonstrated financial need
• Work-Study opportunities: Flexible on-campus employment
• Federal loans: Optional borrowing if needed

Next steps:
1. Log in to Path@UPenn to review your complete award letter
2. Accept or decline each component by the deadline indicated
3. Complete any remaining requirements listed in your checklist
4. Contact us with questions about your package

UPenn is committed to meeting full demonstrated need for all admitted students. If your family's financial situation has changed, please contact us to discuss a special circumstances appeal.

Congratulations, and welcome to Penn!

Warm regards,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

  // Variation 5 - Friendly Reminder
  `Dear Student,

This is a friendly reminder about your financial aid application. We noticed that your file is still missing some required documents.

Outstanding items:
• Parent Tax Return (2024)
• Student W-2 forms
• CSS Profile completion

Impact: Your financial aid package cannot be finalized until we receive these documents. This may delay your award notification and affect your ability to plan for expenses.

Action required: Please submit the outstanding documents within the next 7 days through your Path@UPenn portal.

We understand that gathering financial documents can be challenging. If you need help or have questions, please don't hesitate to contact our office—we're here to support you.

Best regards,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

  // Variation 6 - Appeal Process Info
  `Hello,

Thank you for reaching out about your financial aid package. We understand that every family's financial situation is unique, and we're here to help.

If your circumstances have changed or you'd like to request a review of your aid package, here's how to proceed:

Special Circumstances Appeal:
• Document any significant changes (job loss, medical expenses, etc.)
• Complete the Special Circumstances Form on Path@UPenn
• Provide supporting documentation (unemployment records, medical bills, etc.)
• Allow 2-3 weeks for review

What to include:
→ Detailed explanation of your situation
→ Official documentation supporting your request
→ Any additional context that may be relevant

Our financial aid counselors will carefully review your appeal and work with you to find the best solution. We're committed to making Penn accessible to all admitted students.

Feel free to schedule a meeting with your financial aid counselor to discuss your options.

Sincerely,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`
];

const getRandomEmailVariation = () => {
  const randomIndex = Math.floor(Math.random() * emailVariations.length);
  return emailVariations[randomIndex];
};

export function AIGeneratorModal({ onClose, onComplete, initialStep = 0, initialCampaignDescription = '', initialSelectedTones = [], initialAttachments = [], initialEmailContent, campaignName }: AIGeneratorModalProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = 4;
  const [selectedTones, setSelectedTones] = useState<string[]>(initialSelectedTones);
  const [campaignDescription, setCampaignDescription] = useState(initialCampaignDescription);
  const [emailContent, setEmailContent] = useState(() => initialEmailContent || getRandomEmailVariation());
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>(() => {
    // Convert initial attachment names to File objects
    return initialAttachments.map(name => new File([], name));
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBegin = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete with current email content and attachments (including any edits)
      const fileNames = attachedFiles.map(f => f.name);
      // Exit edit mode before completing to ensure clean state
      setIsEditingEmail(false);
      onComplete(emailContent, fileNames, campaignDescription, selectedTones);
    }
  };

  const handleRegenerate = () => {
    // Generate a new random variation of the email
    const newVariation = getRandomEmailVariation();
    setEmailContent(newVariation);
    // Exit edit mode if user is editing
    setIsEditingEmail(false);
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedFiles([...attachedFiles, ...Array.from(files)]);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const steps = [
    {
      title: 'Use AI to write your campaign emails',
      description: 'Peach generates personalized emails based on your campaign topic. Just describe the issue and Peach takes care of the rest, fast and accurately.',
      buttonText: "Let's begin"
    },
    {
      title: 'Describe your campaign',
      description: 'Enter a short explanation of the issue students are experiencing (e.g. FAFSA error, missing documents, aid suspension) and what next steps or actions you need from them. Peach will use this to generate a clear, personalized email students can understand and act on.',
      buttonText: 'Next'
    },
    {
      title: 'Set Your Tone',
      description: 'Choose the tone and style for your email. Should it be formal, friendly, urgent, or informative?',
      buttonText: 'Next'
    },
    {
      title: 'Review your email',
      description: `Here's the personalized message Peach drafted based on your input. You can edit it, regenerate a new version, or attach any relevant documents before sending.`,
      buttonText: 'Use this suggestion'
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[920px] w-full mx-4 shadow-lg">
        <div className="space-y-6">
          {/* Campaign Name */}
          {campaignName && (
            <div className="pb-2 border-b border-[#e7e7e7]">
              <p className="text-sm text-[#6d6d6d]">Campaign</p>
              <p className="text-[#2e2c34]">{campaignName}</p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-[70px] rounded-full transition-colors duration-300 ${
                  index === currentStep
                    ? 'bg-[#ffa88b]'
                    : index < currentStep
                    ? 'bg-[#ffa88b]'
                    : 'bg-[#f2f1f4]'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl mb-4">{currentStepData.title}</h2>
            <p className="text-[#6d6d6d] max-w-[506px]">
              {currentStepData.description}
            </p>
          </div>

          {/* Step-specific content */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <label className="text-sm text-[#212121]">
              </label>
              <textarea
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                className="w-full px-4 py-3 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors resize-none h-32"
                placeholder="e.g., This is for students who have missing documents in their FAFSA applications..."
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {['Professional', 'Friendly', 'Urgent', 'Supportive'].map((tone) => {
                const isSelected = selectedTones.includes(tone);
                return (
                  <button
                    key={tone}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTones(selectedTones.filter(t => t !== tone));
                      } else {
                        setSelectedTones([...selectedTones, tone]);
                      }
                    }}
                    className={`px-6 py-4 border-2 rounded-lg transition-colors text-left ${
                      isSelected 
                        ? 'border-[#ffa88b] bg-[#fff5f2]' 
                        : 'border-[#e7e7e7] hover:border-[#ffa88b] hover:bg-[#fff5f2]'
                    }`}
                  >
                    <div className="text-sm">{tone}</div>
                  </button>
                );
              })}
            </div>
          )}

          {currentStep === 3 && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="bg-[#f8fbff] border border-[#c4c4c4] rounded-lg p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-start gap-2 mb-6">
                  <div className="w-6 h-[25.5px] shrink-0">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 26">
                      <path d={svgPaths.p20f1be80} fill="black" />
                      <path d={svgPaths.p2f6fef80} fill="black" />
                      <path d={svgPaths.p1c48f200} fill="black" />
                      <path d={svgPaths.p1cf26880} fill="black" />
                      <path clipRule="evenodd" d={svgPaths.p3470e000} fill="black" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPaths.p2aaae000} fill="black" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPaths.p25c38d40} fill="black" fillRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#2e2c34]">AI Suggested Email</p>
                    <p className="text-sm italic text-[#2e2c34] opacity-70">Reference: FAFSA Guide 2024-2025</p>
                  </div>
                </div>

                {/* Email Content */}
                {isEditingEmail ? (
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="w-full min-h-[300px] p-3 text-sm text-[#2e2c34] italic bg-white border border-[#e7e7e7] rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#1849d6]/20 mb-6"
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                ) : (
                  <div className="text-sm text-[#2e2c34] italic whitespace-pre-wrap mb-6 max-h-[300px] overflow-y-auto pr-2">
                    {emailContent}
                  </div>
                )}

                {/* Attached Files */}
                {attachedFiles.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <p className="text-sm text-[#7f7f7f]">Attached files:</p>
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#dddddd] rounded-lg"
                        >
                          <span className="text-xs text-[#2e2c34]">{file.name}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-[#666666]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3.5">
                  <button 
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 bg-[#ffecbd] text-[#424242] rounded-lg hover:bg-[#ffe4a3] transition-colors"
                  >
                    <Edit className="w-6 h-6" />
                    <span className="capitalize">edit</span>
                  </button>
                  
                  <button 
                    onClick={handleRegenerate}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 bg-[#e7e7e7] border border-[#e7e7e7] text-[#424242] rounded-lg hover:bg-[#d7d7d7] transition-colors"
                  >
                    <div className="w-6 h-6">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p3513100} fill="#424242" />
                        <path d={svgPaths.p3b3ba200} fill="#424242" />
                        <path d={svgPaths.p3c056700} fill="#424242" />
                        <path d={svgPaths.pe13e1f0} fill="#424242" />
                        <path clipRule="evenodd" d={svgPaths.p394d2280} fill="#424242" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPaths.p39da7270} fill="#424242" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPaths.p1b15d900} fill="#424242" fillRule="evenodd" />
                      </svg>
                    </div>
                    <span className="capitalize">Regenerate</span>
                  </button>
                  
                  <button 
                    onClick={handleAttach}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 border border-[#424242] text-[#424242] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="capitalize">Attach</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-3 border border-[#cecece] text-[#6d6d6d] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-3 border border-[#cecece] text-[#6d6d6d] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleBegin}
              disabled={currentStep === 1 && !campaignDescription.trim()}
              className="px-4 py-3 bg-[#2e2c34] text-white rounded-lg hover:bg-[#1e1c24] transition-colors disabled:bg-[rgba(46,44,52,0.2)] disabled:cursor-not-allowed"
            >
              {currentStepData.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}