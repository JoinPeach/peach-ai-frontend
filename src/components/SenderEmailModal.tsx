import { useState } from 'react';

interface SenderOption {
  name: string;
  email: string;
}

const senderOptions: SenderOption[] = [
  { name: 'Puneet Thiara', email: 'pthiara@university.edu' },
  { name: 'Financial Aid', email: 'financialaid@university.edu' },
  { name: 'Work Study', email: 'workstudy@university.edu' },
  { name: 'Loans', email: 'loans@university.edu' },
];

interface SenderEmailModalProps {
  onClose: () => void;
  onSave: (sender: SenderOption) => void;
  initialSender?: SenderOption;
}

export function SenderEmailModal({ onClose, onSave, initialSender }: SenderEmailModalProps) {
  const [selectedSender, setSelectedSender] = useState<SenderOption>(
    initialSender || senderOptions[0]
  );

  const handleSave = () => {
    onSave(selectedSender);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[920px] w-full mx-4 shadow-lg">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl mb-2">Sender</h2>
            <p className="text-[#6d6d6d]">Select the email address to send this campaign from</p>
          </div>

          {/* Email Options */}
          <div className="space-y-3">
            {senderOptions.map((option) => (
              <button
                key={option.email}
                onClick={() => setSelectedSender(option)}
                className="w-full flex items-center gap-4 p-4 border border-[#e7e7e7] rounded-xl hover:border-[#3c4043] transition-colors text-left"
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {selectedSender.email === option.email ? (
                    <div className="w-5 h-5 rounded-full border-[6px] border-[#2e2c34]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#7f7f7f]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#212121]">{option.name}</div>
                  <div className="text-[14px] text-[#7f7f7f]">{option.email}</div>
                </div>
              </button>
            ))}
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
              className="px-4 py-3 bg-[#2e2c34] text-white rounded-lg hover:bg-[#1e1c24] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}