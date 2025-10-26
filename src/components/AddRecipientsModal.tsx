import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface AddRecipientsModalProps {
  onClose: () => void;
  onSave: (recipients: string[]) => void;
  initialRecipients?: string[];
}

const mockEmails = [
  'jlennon@university.edu',
  'bjones@university.edu',
  'jabdul3@university.edu',
  'mlamburg6@university.edu',
  'ssmith@university.edu',
  'ajohnson@university.edu',
  'kwilliams@university.edu',
  'dbrown@university.edu',
];

export function AddRecipientsModal({ onClose, onSave, initialRecipients = [] }: AddRecipientsModalProps) {
  const [recipients, setRecipients] = useState<string[]>(initialRecipients);
  const maxEmails = 500;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate parsing CSV and adding recipients
      // In a real app, you'd parse the CSV file here
      const mockCount = Math.floor(Math.random() * 20) + 10;
      const newRecipients = Array.from({ length: mockCount }, (_, i) => 
        mockEmails[i % mockEmails.length].replace('@', `${i}@`)
      );
      setRecipients(newRecipients);
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[920px] w-full mx-4 shadow-lg">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl mb-2">Recipients</h2>
            <p className="text-[#6d6d6d]">
              {recipients.length > 0 
                ? `${recipients.length} student${recipients.length !== 1 ? 's' : ''} will receive your email campaign`
                : 'Upload a CSV or Excel file that includes at least one column with student email addresses.'}
            </p>
          </div>

          {/* Upload Area / Recipients Display */}
          {recipients.length === 0 ? (
            <div className="border-2 border-dashed border-[#1849d6] rounded-lg p-6 bg-white">
              <div className="flex flex-col items-center gap-3">
                <div className="w-[42px] h-[42px]">
                  <svg viewBox="0 0 42 42" fill="none">
                    <path d="M33.4418 3.12071H14.1744V11.1107H37.5569V7.23413C37.5569 4.96577 35.7108 3.12071 33.4418 3.12071Z" fill="#CED9F9"/>
                    <path d="M22.5352 12.3403H0V4.92636C0 2.20972 2.21068 0 4.92828 0H12.1336C12.8497 0 13.5396 0.150925 14.1664 0.434509C15.0418 0.828964 15.7939 1.47913 16.3213 2.3286L22.5352 12.3403Z" fill="#1640C1"/>
                    <path d="M42 14.0001V37.8815C42 40.1527 40.1511 42 37.8789 42H4.12111C1.84891 42 0 40.1527 0 37.8815V9.8806H37.8789C40.1511 9.8806 42 11.7285 42 14.0001Z" fill="#2354E6"/>
                    <path d="M42 14.0001V37.8815C42 40.1527 40.1511 42 37.8789 42H21V9.8806H37.8789C40.1511 9.8806 42 11.7285 42 14.0001Z" fill="#1849D6"/>
                    <path d="M32.0479 25.9398C32.0479 32.0322 27.0918 36.9887 21 36.9887C14.9082 36.9887 9.95206 32.0322 9.95206 25.9398C9.95206 19.8484 14.9082 14.8919 21 14.8919C27.0918 14.8919 32.0479 19.8484 32.0479 25.9398Z" fill="#E7ECFC"/>
                    <path d="M32.0479 25.9398C32.0479 32.0322 27.0918 36.9887 21 36.9887V14.8919C27.0918 14.8919 32.0479 19.8484 32.0479 25.9398Z" fill="#CED9F9"/>
                    <path d="M24.561 26.0754C24.3306 26.2705 24.0483 26.3657 23.7686 26.3657C23.4183 26.3657 23.0703 26.2173 22.8268 25.9283L22.2305 25.2214V29.8494C22.2305 30.5288 21.6793 31.0799 21 31.0799C20.3207 31.0799 19.7695 30.5288 19.7695 29.8494V25.2214L19.1732 25.9283C18.7342 26.4477 17.9584 26.514 17.439 26.0754C16.9199 25.6373 16.8533 24.8612 17.2913 24.3418L19.7269 21.4544C20.0445 21.0788 20.5078 20.8629 21 20.8629C21.4922 20.8629 21.9555 21.0788 22.2731 21.4544L24.7087 24.3418C25.1467 24.8612 25.0801 25.6373 24.561 26.0754Z" fill="#6C8DEF"/>
                    <path d="M24.561 26.0754C24.3306 26.2705 24.0483 26.3657 23.7686 26.3657C23.4183 26.3657 23.0703 26.2173 22.8268 25.9283L22.2305 25.2214V29.8494C22.2305 30.5288 21.6793 31.0799 21 31.0799V20.8629C21.4922 20.8629 21.9555 21.0788 22.2731 21.4544L24.7087 24.3418C25.1467 24.8612 25.0801 25.6373 24.561 26.0754Z" fill="#3B67E9"/>
                  </svg>
                </div>

                <p className="text-sm text-[#84818a] text-center">
                  Drag your file(s) to start uploading (e.g. include full name and email)
                </p>

                <div className="flex items-center gap-3 w-[201px]">
                  <div className="flex-1 h-px bg-[#e7e7e7]" />
                  <span className="text-xs text-[#6d6d6d]">OR</span>
                  <div className="flex-1 h-px bg-[#e7e7e7]" />
                </div>

                <label className="px-3 py-1.5 border border-[#1849d6] text-[#1849d6] rounded-lg text-xs cursor-pointer hover:bg-[#1849d6] hover:text-white transition-colors">
                  Browse files
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="border border-[#e7e7e7] rounded-lg p-8 bg-white min-h-[199px] max-h-[400px] overflow-y-auto">
              <div className="flex flex-wrap gap-3">
                {recipients.map((email, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-[#dddddd] rounded-lg px-3 py-1.5 flex items-center gap-2"
                  >
                    <span className="text-xs text-black">{email}</span>
                    <button
                      onClick={() => removeRecipient(index)}
                      className="hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#0b0b0b]">{recipients.length} recipients</span>
              <span className="text-[15px] text-[#0b0b0b]">{maxEmails - recipients.length} remaining emails</span>
            </div>
            <div className="w-full h-2 bg-[#e7e7e7] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ffa88b] transition-all duration-300"
                style={{ width: `${(recipients.length / maxEmails) * 100}%` }}
              />
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
              onClick={() => onSave(recipients)}
              disabled={recipients.length === 0}
              className="px-4 py-3 bg-[#2e2c34] text-white rounded-lg hover:bg-[#1e1c24] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}