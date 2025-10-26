import { useState, useRef, useEffect } from 'react';
import { Edit, Upload, FileText, X } from 'lucide-react';
import svgPaths from '../imports/svg-jo71mvv1mo';

// AI Response Templates for campaigns
const generateCampaignResponse = (): string => {
  const responses = [
    // Response 1 - Confirmation and next steps
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

    // Response 2 - Document request
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

    // Response 3 - Verification process
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

    // Response 4 - Award notification
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

    // Response 5 - Reminder
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
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`
  ];

  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

interface GeneratedEmailDisplayProps {
  onContentChange?: (content: string, attachments: string[]) => void;
  campaignDescription?: string;
  selectedTones?: string[];
  onOpenGenerator?: () => void;
  initialContent?: string;
  initialAttachments?: string[];
}

export function GeneratedEmailDisplay({ 
  onContentChange, 
  campaignDescription = '',
  selectedTones = [],
  onOpenGenerator,
  initialContent,
  initialAttachments = []
}: GeneratedEmailDisplayProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState(initialContent || (() => generateCampaignResponse()));
  const [attachedFiles, setAttachedFiles] = useState<File[]>(() => {
    // Convert initial attachment names to File objects for display
    return initialAttachments.map(name => new File([], name));
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when initialContent changes (e.g., from modal)
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // Update attachments when initialAttachments changes
  useEffect(() => {
    if (initialAttachments.length > 0) {
      setAttachedFiles(initialAttachments.map(name => new File([], name)));
    }
  }, [initialAttachments]);

  // Notify parent of initial content on mount
  useEffect(() => {
    if (onContentChange && !initialContent) {
      onContentChange(content, []);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent of content changes
  const notifyContentChange = (newContent: string, files: File[]) => {
    if (onContentChange) {
      const fileNames = files.map(f => f.name);
      onContentChange(newContent, fileNames);
    }
  };

  const handleRegenerate = () => {
    // If we have a generator callback, use it to open the modal with context
    if (onOpenGenerator) {
      onOpenGenerator();
    } else {
      // Fallback to inline generation if no modal is available
      const newResponse = generateCampaignResponse();
      setContent(newResponse);
      setShowEditor(false);
      notifyContentChange(newResponse, attachedFiles);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = [...attachedFiles, ...Array.from(files)];
      setAttachedFiles(newFiles);
      event.target.value = '';
      notifyContentChange(content, newFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(newFiles);
    notifyContentChange(content, newFiles);
  };

  const handleSaveEdit = () => {
    setShowEditor(false);
    notifyContentChange(content, attachedFiles);
  };
  if (showEditor) {
    return (
      <div className="bg-white border border-[#e7e7e7] rounded-2xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-[#e7e7e7] px-4 py-3 border-b border-[#e7e7e7] flex items-center gap-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="black"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881Z" fill="black"/>
          </svg>
          <div>
            <p className="font-semibold text-[#2e2c34]">AI Suggested Email</p>
            <p className="text-sm italic text-[#2e2c34] opacity-70">Reference: FAFSA Guide 2024-2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] p-4 italic text-base text-[#2e2c34] bg-white border border-[#e7e7e7] rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#1990ff]/20"
            style={{ whiteSpace: 'pre-wrap' }}
          />

          {/* Attached Files Display in Editor */}
          {attachedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-[#7f7f7f]">Attached files:</p>
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#ced0df] rounded-lg"
                  >
                    <FileText className="w-4 h-4 text-[#666666]" />
                    <span className="text-sm text-[#2e2c34]">{file.name}</span>
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
        </div>

        {/* Footer with buttons */}
        <div className="bg-[#f2f2f2] border-t border-black/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleAttachClick}
              className="px-4 py-2 border border-[#424242] hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="capitalize text-[#424242]">Attach</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditor(false)}
                className="px-5 py-2 bg-[#5f6369] hover:bg-[#4a4e54] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#1990ff] hover:bg-[#1580e6] text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
        <div className="text-sm text-[#2e2c34] italic whitespace-pre-wrap mb-6 max-h-[300px] overflow-y-auto pr-2">
          {content}
        </div>

        {/* Attached Files Display */}
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
            onClick={() => setShowEditor(true)}
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
            onClick={handleAttachClick}
            className="flex items-center gap-2.5 px-2.5 py-2.5 border border-[#424242] text-[#424242] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-6 h-6" />
            <span className="capitalize">Attach</span>
          </button>
        </div>
      </div>
    </>
  );
}