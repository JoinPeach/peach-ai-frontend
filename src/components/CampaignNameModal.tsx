import { useState } from 'react';

interface CampaignNameModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  isEditing?: boolean;
}

export function CampaignNameModal({ onClose, onSubmit, initialName = '', isEditing = false }: CampaignNameModalProps) {
  const [campaignName, setCampaignName] = useState(initialName);
  const maxLength = 140;

  const handleSubmit = () => {
    if (campaignName.trim()) {
      onSubmit(campaignName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-10 max-w-[592px] w-full mx-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-[40px] tracking-[-1.8px] mb-[16px] font-normal p-[0px] mt-[0px] mr-[0px] ml-[0px] no-underline">
              What would you like to name your campaign?
            </h2>
            <p className="text-[17px] text-[#6c6685] tracking-[-0.3px]">
              Choose a name that makes this campaign easy to find and reference later.
            </p>
          </div>

          <div className="space-y-1">
          
            <div className="relative">
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value.slice(0, maxLength))}
                placeholder="Enter campaign name"
                maxLength={maxLength}
                className="w-full px-4 py-3 border border-[#7f7f7f] rounded-xl text-[15px] outline-none focus:border-black transition-colors"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#6c6685] tracking-[-0.1px]">
                {campaignName.length}/{maxLength}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="px-10 py-3.5 border border-[#3c4043] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!campaignName.trim()}
              className="px-10 py-3.5 bg-[#3c4043] text-white rounded-lg hover:bg-[#2c2e31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update' : 'Create Campaign'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}