import { useState } from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';
import { CampaignNameModal } from './CampaignNameModal';
import { CampaignBuilder, CampaignDraft } from './CampaignBuilder';
import { Checkbox } from './ui/checkbox';
import DocumentAnalysis1 from '../imports/DocumentAnalysis1';
import { CompletedCampaign } from './EmailPlatform';

interface Campaign {
  id: string;
  name: string;
  created: string;
  createdBy: string;
  completedDate?: string;
  status: 'completed' | 'draft';
}

interface CampaignsViewProps {
  draftCampaigns: CampaignDraft[];
  completedCampaigns: CompletedCampaign[];
  onSaveDraft: (draft: CampaignDraft) => void;
  onDeleteCampaigns: (campaignIds: string[]) => void;
  onCompleteCampaign: (draft: CampaignDraft, emailContent: string, attachments: string[]) => void;
  onOpenMobileMenu?: () => void;
}

export function CampaignsView({ draftCampaigns, completedCampaigns, onSaveDraft, onDeleteCampaigns, onCompleteCampaign, onOpenMobileMenu }: CampaignsViewProps) {
  const [showNameModal, setShowNameModal] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<CampaignDraft | null>(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());

  // Merge draft campaigns with completed campaigns
  const allCampaigns: Campaign[] = [
    ...draftCampaigns.map(draft => ({
      id: draft.id,
      name: draft.name,
      created: draft.created,
      createdBy: draft.createdBy,
      status: 'draft' as const,
    })),
    ...completedCampaigns.map(completed => ({
      id: completed.id,
      name: completed.name,
      created: completed.created,
      createdBy: completed.createdBy,
      completedDate: completed.completedDate,
      status: 'completed' as const,
    })),
  ];

  const handleCreateCampaign = (name: string) => {
    setActiveCampaign(name);
    setShowNameModal(false);
  };

  const toggleCampaign = (id: string) => {
    const newSelected = new Set(selectedCampaigns);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCampaigns(newSelected);
  };

  const handleDraftClick = (campaignId: string) => {
    const draft = draftCampaigns.find(d => d.id === campaignId);
    if (draft) {
      setEditingDraft(draft);
    }
  };

  const handleSaveAndReturn = (draft: CampaignDraft) => {
    onSaveDraft(draft);
    setActiveCampaign(null);
    setEditingDraft(null);
  };

  const handleDelete = () => {
    if (selectedCampaigns.size > 0) {
      onDeleteCampaigns(Array.from(selectedCampaigns));
      setSelectedCampaigns(new Set());
    }
  };

  const handleCompleteAndReturn = (draft: CampaignDraft, emailContent: string, attachments: string[]) => {
    onCompleteCampaign(draft, emailContent, attachments);
    setActiveCampaign(null);
    setEditingDraft(null);
  };

  if (activeCampaign) {
    return (
      <CampaignBuilder 
        campaignName={activeCampaign}
        onBack={() => setActiveCampaign(null)}
        onSaveDraft={handleSaveAndReturn}
        onCompleteCampaign={handleCompleteAndReturn}
      />
    );
  }

  if (editingDraft) {
    return (
      <CampaignBuilder 
        campaignName={editingDraft.name}
        onBack={() => setEditingDraft(null)}
        onSaveDraft={handleSaveAndReturn}
        onCompleteCampaign={handleCompleteAndReturn}
        draftData={editingDraft}
      />
    );
  }

  // Empty State
  if (allCampaigns.length === 0) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col items-center max-w-[554px] text-center">
          {/* Icon */}
          <div className="w-[80px] h-[80px] mb-6">
            <DocumentAnalysis1 />
          </div>

          {/* Title */}
          <h2 className="text-[20px] text-[#3c4043] mb-4">Send a batch of personalized emails instantly.</h2>

          {/* Description */}
          <p className="text-[#7f7f7f] mb-8">
            Upload a list of students, describe the issue, and let Peach draft and send each message for you.
          </p>

          {/* Create Campaign Button */}
          <button
            onClick={() => setShowNameModal(true)}
            className="px-10 py-3.5 bg-[#3c4043] text-white rounded-lg hover:bg-[#2c2e31] transition-colors"
          >
            Create Campaign
          </button>
        </div>

        {showNameModal && (
          <CampaignNameModal 
            onClose={() => setShowNameModal(false)}
            onSubmit={handleCreateCampaign}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-4 lg:p-8 overflow-y-auto">
      {/* Search and Actions */}
      <div className="bg-white border border-[#eaecf0] rounded-lg mb-6 lg:mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between px-4 lg:px-6 py-4 lg:py-5 border-b border-[#eaecf0] gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[rgba(242,243,245,0.5)] px-3 py-2.5 rounded-lg flex-1 lg:w-[412px]">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="lg:hidden flex h-6 w-6 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Search className="w-6 h-6 text-[#7f7f7f]" />
            <span className="text-[#7f7f7f]">Search for a campaign</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handleDelete}
              className={`px-4 py-2.5 border border-[#3c4043] rounded-lg transition-colors ${
                selectedCampaigns.size > 0 ? 'text-[#344054] hover:bg-gray-50' : 'text-[rgba(52,64,84,0.2)] cursor-not-allowed'
              }`}
              disabled={selectedCampaigns.size === 0}
            >
              Delete
            </button>
            <button 
              onClick={() => setShowNameModal(true)}
              className="px-4 py-2.5 bg-[#3c4043] text-white rounded-lg hover:bg-[#2c2e31] transition-colors shadow-sm"
            >
              Create campaign
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fcfcfd]">
              <tr className="border-b border-[#eaecf0]">
                <th className="w-[66px] px-4 py-3"></th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-1 text-sm text-[#667085]">
                    Campaign Name
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-1 text-sm text-[#667085]">
                    Created
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-1 text-sm text-[#667085]">
                    Created By
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-1 text-sm text-[#667085]">
                    Completed Date
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-1 text-xs text-[#667085]">
                    Status
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {allCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-[#eaecf0] hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedCampaigns.has(campaign.id)}
                      onCheckedChange={() => toggleCampaign(campaign.id)}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => campaign.status === 'draft' ? handleDraftClick(campaign.id) : null}
                      className="text-[#101828] hover:underline text-left"
                    >
                      {campaign.name}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-[#667085] text-sm">
                    {campaign.created}
                  </td>
                  <td className="px-6 py-3 text-[#667085] text-sm">
                    {campaign.createdBy}
                  </td>
                  <td className="px-6 py-3 text-[#667085] text-sm">
                    {campaign.completedDate || ''}
                  </td>
                  <td className="px-6 py-3">
                    {campaign.status === 'completed' ? (
                      <span className="inline-flex items-center px-2 py-1 bg-[#f2f4f7] text-[#364254] text-xs rounded-full">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDraftClick(campaign.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#5f6369] text-white text-xs rounded-full hover:bg-[#4a4d52] transition-colors"
                      >
                        Draft
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                          <path d="M2 11.5V14H4.5L11.8733 6.62667L9.37333 4.12667L2 11.5ZM13.8067 4.69333C14.0667 4.43333 14.0667 4.01333 13.8067 3.75333L12.2467 2.19333C11.9867 1.93333 11.5667 1.93333 11.3067 2.19333L10.0867 3.41333L12.5867 5.91333L13.8067 4.69333Z" fill="white"/>
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading indicator at bottom */}
        <div className="px-3 py-2 border-t border-[#eaecf0]">
          <div className="bg-[#eaecf0] h-1.5 rounded-full w-[407px]" />
        </div>
      </div>

      {showNameModal && (
        <CampaignNameModal 
          onClose={() => setShowNameModal(false)}
          onSubmit={handleCreateCampaign}
        />
      )}
    </div>
  );
}