import { useState } from 'react';
import { Search, Mail, FileText, Users, Calendar, Menu, ArrowLeft } from 'lucide-react';

export interface SentEmail {
  id: string;
  type: 'email' | 'campaign';
  subject: string;
  recipient: string;
  recipientEmail: string;
  recipientCount?: number; // For campaigns
  sentDate: string;
  sentTime: string;
  content: string;
  attachments: string[];
  aiReference?: string;
}

interface SentViewProps {
  sentItems: SentEmail[];
  onOpenMobileMenu?: () => void;
}

export function SentView({ sentItems, onOpenMobileMenu }: SentViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  const filteredItems = sentItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.subject.toLowerCase().includes(query) ||
      item.recipient.toLowerCase().includes(query) ||
      item.recipientEmail.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  });

  const selectedItem = filteredItems.find(item => item.id === selectedItemId);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
  };

  return (
    <div className="flex-1 flex bg-white overflow-hidden">
      {/* Left Panel - Sent Items List */}
      <div className={`${showDetail ? 'hidden lg:flex' : 'flex'} w-full lg:w-[452px] h-full border-r border-black/10 flex-col bg-white`}>
        <div className="p-4 lg:p-6 space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <div className="flex items-baseline gap-2">
                {onOpenMobileMenu && (
                  <button
                    onClick={onOpenMobileMenu}
                    className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black flex-shrink-0 -ml-2"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                )}
                <h1 className="text-xl lg:text-2xl font-medium">Sent</h1>
                <span className="text-sm text-[#7f7f7f]">{filteredItems.length} items</span>
              </div>
            </div>
            <p className="text-sm text-[#7f7f7f]">View all sent emails and campaigns</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7f7f7f]" />
            <input
              type="text"
              placeholder="Search sent items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[rgba(242,243,245,0.5)] rounded-lg outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>

        <div className="border-t border-black/10" />

        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
              <Mail className="w-12 h-12 text-[#c4c4c4] mb-4" />
              <p className="text-[#7f7f7f]">
                {searchQuery ? 'No items found' : 'No sent items yet'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleSelectItem(item.id)}
                  className={`w-full px-4 lg:px-6 py-3 lg:py-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedItemId === item.id ? 'bg-[#f8fbff] border-l-2 border-[#3b8aff]' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'campaign' ? (
                            <Users className="w-4 h-4 text-[#1990ff] flex-shrink-0" />
                          ) : (
                            <Mail className="w-4 h-4 text-[#14ba6d] flex-shrink-0" />
                          )}
                          <span className="text-xs text-[#7f7f7f] uppercase">
                            {item.type}
                          </span>
                        </div>
                        <p className="font-medium truncate">{item.subject}</p>
                        <p className="text-sm text-[#7f7f7f] truncate">
                          To: {item.recipient}
                          {item.recipientCount && ` (+${item.recipientCount - 1} more)`}
                        </p>
                      </div>
                      <span className="text-xs text-[#7f7f7f] flex-shrink-0">
                        {item.sentTime}
                      </span>
                    </div>
                  </div>
                </button>
                <div className="h-px bg-[#F2F3F5]" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Selected Item Details */}
      {selectedItem ? (
        <div className={`${showDetail ? 'flex' : 'hidden lg:flex'} flex-1 flex-col border-l border-black/10 bg-white`}>
          {/* Header */}
          <div className="px-4 lg:px-7 py-4 border-b border-zinc-200">
            <div className="flex items-center gap-2 mb-2">
              {/* Mobile back button */}
              <button
                onClick={handleBackToList}
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-[#666666]" />
              </button>
              {selectedItem.type === 'campaign' ? (
                <Users className="w-5 h-5 text-[#1990ff]" />
              ) : (
                <Mail className="w-5 h-5 text-[#14ba6d]" />
              )}
              <span className="text-sm uppercase text-[#7f7f7f]">
                {selectedItem.type} • Sent
              </span>
            </div>
            <h2 className="text-lg lg:text-xl font-medium">{selectedItem.subject}</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-3xl space-y-6">
              {/* Metadata */}
              <div className="bg-[#f8f9fa] rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#7f7f7f] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#7f7f7f]">Sent on</p>
                    <p className="text-sm font-medium">{selectedItem.sentDate} at {selectedItem.sentTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {selectedItem.type === 'campaign' ? (
                    <Users className="w-5 h-5 text-[#7f7f7f] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Mail className="w-5 h-5 text-[#7f7f7f] flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-[#7f7f7f]">
                      {selectedItem.type === 'campaign' ? 'Recipients' : 'Recipient'}
                    </p>
                    <p className="text-sm font-medium">
                      {selectedItem.recipient}
                      {selectedItem.recipientCount && selectedItem.recipientCount > 1 && (
                        <span className="text-[#7f7f7f] ml-2">
                          +{selectedItem.recipientCount - 1} more
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {selectedItem.aiReference && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                      <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="#7f7f7f"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881Z" fill="#7f7f7f"/>
                    </svg>
                    <div>
                      <p className="text-sm text-[#7f7f7f]">AI Reference</p>
                      <p className="text-sm font-medium italic">{selectedItem.aiReference}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Content */}
              <div>
                <h3 className="text-sm font-medium text-[#7f7f7f] mb-3">Message Content</h3>
                <div className="bg-white border border-[#e7e7e7] rounded-lg p-6">
                  <div className="text-base leading-relaxed whitespace-pre-wrap text-[#1e1919]">
                    {selectedItem.content}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {selectedItem.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#7f7f7f] mb-3">Attachments</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.attachments.map((attachment, index) => (
                      <div 
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#ced0df] rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-[#666666]" />
                        <span className="text-sm text-[#2e2c34]">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center border-l border-black/10">
          <div className="text-center">
            <Mail className="w-12 h-12 text-[#c4c4c4] mb-4 mx-auto" />
            <h2 className="text-lg font-medium mb-2">No item selected</h2>
            <p className="text-sm text-[#7f7f7f]">Select an item to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}