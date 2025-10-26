import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Paperclip, Check, User, Users, Menu, RefreshCw } from 'lucide-react';
import { Email } from './EmailPlatform';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  onInboxChange?: (selectedInbox: string) => void;
  onOpenMobileMenu?: () => void;
  onRefreshEmails?: () => void;
  isRefreshing?: boolean;
  hideAssignedTag?: boolean;
}

const inboxOptions = [
  'pthiara@university.edu',
  'financialaid@university.edu',
  'workstudy@university.edu',
  'loans@university.edu'
];

export function EmailList({ emails, selectedEmailId, onSelectEmail, onInboxChange, onOpenMobileMenu, onRefreshEmails, isRefreshing, hideAssignedTag = false }: EmailListProps) {
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>(inboxOptions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter emails based on search query and selected inboxes
  const filteredEmails = emails.filter((email) => {
    // First apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        email.sender.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        (email.preview && email.preview.toLowerCase().includes(query))
      );
      if (!matchesSearch) return false;
    }
    
    // Then apply inbox filter based on email's inboxAddress
    if (selectedInboxes.length > 0 && selectedInboxes.length < inboxOptions.length) {
      // Only show emails that match one of the selected inboxes
      return email.inboxAddress && selectedInboxes.includes(email.inboxAddress);
    }
    
    // Show all emails if all inboxes are selected or none are selected
    return true;
  }).sort((a, b) => {
    // Sort unread emails to the top
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    return 0;
  });

  const unreadCount = filteredEmails.filter(e => e.unread).length;

  // Notify parent of selected inbox change
  useEffect(() => {
    if (onInboxChange) {
      // Use first selected inbox, or default to first option if all selected
      const primaryInbox = selectedInboxes.length > 0 && selectedInboxes.length < inboxOptions.length
        ? selectedInboxes[0]
        : inboxOptions[0];
      onInboxChange(primaryInbox);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInboxes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full lg:w-[452px] h-full border-r border-black/10 flex flex-col bg-white">
      <div className="p-4 lg:p-6 space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-2 p-[0px]">
            <div className="flex items-baseline gap-2">
              {/* Mobile hamburger menu */}
              {onOpenMobileMenu && (
                <button
                  onClick={onOpenMobileMenu}
                  className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black flex-shrink-0 -ml-2"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-xl lg:text-2xl font-medium">Inbox</h1>
              <span className="text-sm text-[#7f7f7f]">{unreadCount} unread</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh button */}
              {onRefreshEmails && (
                <button
                  onClick={onRefreshEmails}
                  disabled={isRefreshing}
                  className="hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black disabled:opacity-50"
                  title="Refresh emails"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              )}
              <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-[#c4c4c4] rounded-lg text-sm text-[#7f7f7f] hover:bg-gray-50"
              >
                <span className="hidden sm:inline">
                  {selectedInboxes.length === 0 || selectedInboxes.length === inboxOptions.length
                    ? 'All inboxes' 
                    : selectedInboxes.length === 1 
                    ? selectedInboxes[0]
                    : `${selectedInboxes.length} selected`
                  }
                </span>
                <span className="sm:hidden">
                  {selectedInboxes.length === 0 || selectedInboxes.length === inboxOptions.length
                    ? 'All' 
                    : selectedInboxes.length}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[280px] bg-white border border-[#c4c4c4] rounded-lg shadow-lg z-10 py-1">
                  {inboxOptions.map((inbox, index) => {
                    const isChecked = selectedInboxes.includes(inbox);
                    const isMyInbox = index === 0;
                    return (
                      <button
                        key={inbox}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedInboxes(selectedInboxes.filter(i => i !== inbox));
                          } else {
                            setSelectedInboxes([...selectedInboxes, inbox]);
                          }
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#7f7f7f] hover:bg-gray-50 flex items-center gap-3"
                      >
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked 
                            ? 'bg-[#1990ff] border-[#1990ff]' 
                            : 'border-[#c4c4c4] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <span className="flex-1">{inbox}</span>
                        {isMyInbox ? (
                          <User className="w-4 h-4 text-[#7f7f7f] flex-shrink-0" />
                        ) : (
                          <Users className="w-4 h-4 text-[#7f7f7f] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              </div>
            </div>
          </div>
          <p className="text-sm text-[#7f7f7f]">Manage all incoming emails</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7f7f7f]" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[rgba(242,243,245,0.5)] rounded-lg outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      <div className="border-t border-black/10" />

      <div className="flex-1 overflow-y-auto">
        {filteredEmails.map((email) => (
          <div key={email.id}>
            <button
              onClick={() => onSelectEmail(email.id)}
              className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                selectedEmailId === email.id ? 'bg-[#f8fbff] border-l-2 border-[#3b8aff]' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{email.sender}</p>
                      {!hideAssignedTag && email.assignedTo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[#e8f4f0] text-[#14ba6d] rounded">
                          <span className="w-1.5 h-1.5 bg-[#14ba6d] rounded-full"></span>
                          {email.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                  {email.hasAttachment && (
                    <div className="flex-shrink-0">
                      <Paperclip className="w-4 h-4 text-[#666666] rotate-[240deg]" />
                    </div>
                  )}
                  <span className="text-xs text-[#7f7f7f] flex-shrink-0">{email.time}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm flex-1 truncate">
                    <span className="font-normal">{email.subject}</span>
                    {email.preview && (
                      <>
                        <span className="font-light text-[#7f7f7f]"> - </span>
                        <span className="font-light text-[#7f7f7f] text-[13px]">{email.preview}</span>
                      </>
                    )}
                  </p>
                  {email.unread && (
                    <div className="w-2 h-2 rounded-full bg-[#006AD4] flex-shrink-0" />
                  )}
                </div>
              </div>
            </button>
            <div className="h-px bg-[#F2F3F5]" />
          </div>
        ))}
      </div>
    </div>
  );
}