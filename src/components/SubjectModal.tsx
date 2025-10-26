import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SubjectModalProps {
  onClose: () => void;
  onSave: (subject: string) => void;
  initialSubject?: string;
}

export function SubjectModal({ onClose, onSave, initialSubject = '' }: SubjectModalProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [isGenerating, setIsGenerating] = useState(false);
  const maxLength = 140;

  const subjectLineOptions = [
    "Important: FAFSA Deadline Approaching - Complete Your Application Today",
    "Action Required: Missing Documents for Your Financial Aid Application",
    "Your Financial Aid Award Letter is Ready to View",
    "Reminder: Work-Study Program Application Due This Friday",
    "Update on Your Student Loan Application Status",
    "Scholarship Opportunity: Apply Before the Deadline",
    "Important Changes to Your Financial Aid Package",
    "Complete Your Verification Documents to Receive Aid",
  ];

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const randomSubject = subjectLineOptions[Math.floor(Math.random() * subjectLineOptions.length)];
    setSubject(randomSubject);
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (subject.trim()) {
      onSave(subject);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[920px] w-full mx-4 shadow-lg">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl mb-2">Subject</h2>
            <p className="text-[#6d6d6d]">Add a subject line for this campaign</p>
          </div>

          {/* AI Generate Button */}
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>

          {/* Input Field */}
          <div className="space-y-1">
            <label className="text-[13.5px] text-[#212121]">
              Subject line
            </label>
            <div className="relative">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value.slice(0, maxLength))}
                maxLength={maxLength}
                placeholder={isGenerating ? "Generating subject line..." : ""}
                className="w-full px-4 py-3 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#6c6685]">
                {subject.length}/{maxLength}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-3 border border-[#cecece] text-[#6d6d6d] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!subject.trim()}
              className="px-4 py-3 bg-[#2e2c34] text-white rounded-lg hover:bg-[#1e1c24] transition-colors disabled:bg-[rgba(46,44,52,0.2)] disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}