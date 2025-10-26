import { Home, Inbox, Send, Megaphone, BookOpen, BarChart3, Settings, X, PanelLeftClose, PanelLeftOpen, FolderOpen } from 'lucide-react';

interface SidebarProps {
  activeView: 'home' | 'inbox' | 'sent' | 'campaigns' | 'knowledge' | 'analytics' | 'settings';
  onNavigate: (view: 'home' | 'inbox' | 'sent' | 'campaigns' | 'knowledge' | 'analytics' | 'settings') => void;
  totalCount: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onLogoClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ activeView, onNavigate, totalCount, isMobileOpen = false, onMobileClose, onLogoClick, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        inset-y-0 left-0
        h-full 
        border-r border-black/10 
        flex flex-col 
        bg-white
        z-50
        transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-[80px]' : 'w-[280px] lg:w-[300px]'}
      `}>
      <div className="p-4 lg:p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <svg className="h-[31px] w-[130px]" fill="none" viewBox="0 0 130 31">
              <g clipPath="url(#clip0)">
                <path d="M26.2641 18.2381C26.2848 22.1626 24.6129 25.6241 21.556 27.9848C19.4633 29.5999 16.8702 30.5736 14.258 30.7957C13.627 30.8438 13.9202 30.8438 13.627 30.8438C13.3528 30.8438 13.5473 30.8473 13.0212 30.8438C12.0809 30.8376 11.1469 30.732 10.2432 30.5208C5.23711 29.3499 2.07661 25.8292 0.890823 23.1689C-0.42725 20.2103 0.0349531 17.4538 0.294742 16.407C0.906761 13.9425 2.42724 11.6844 4.46572 10.209C9.06542 6.88404 15.3657 8.30661 18.3637 11.7217C19.7885 13.3446 20.689 15.5591 20.8962 17.9585C21.0699 19.9557 20.7511 21.8768 20.0658 22.9716C19.8826 23.2651 19.4904 23.3568 19.1892 23.1782C18.8881 22.9996 18.794 22.6176 18.9773 22.3241C20.0068 20.6794 20.1885 15.7114 17.3946 12.5277C16.0654 11.015 14.0173 9.96987 11.7749 9.66238C9.38258 9.33315 7.05564 9.88135 5.22436 11.2061C3.42177 12.509 2.07501 14.5109 1.53312 16.6975C1.30362 17.6231 0.894011 20.0597 2.05907 22.6719C3.2114 25.2577 6.28104 28.314 10.5397 29.311C13.9663 30.1123 17.8823 29.2303 20.7607 27.008C23.5037 24.8897 25.0051 21.7758 24.9859 18.2412C24.9763 16.5065 24.5253 14.0061 22.423 11.95C21.1879 10.7402 19.5303 9.83787 17.4966 9.26481C17.1588 9.17007 16.9627 8.82531 17.0615 8.49607C17.1588 8.16684 17.5126 7.97582 17.8505 8.0721C20.0944 8.70418 21.937 9.71363 23.3268 11.0741C25.2313 12.9377 26.2449 15.4147 26.2609 18.2365L26.2641 18.2381Z" fill="#FFA88B"/>
                <path d="M15.2912 8.40016C15.2801 8.40016 15.2688 8.40016 15.2577 8.40016C14.9055 8.38307 14.6361 8.08955 14.6537 7.74789C14.6537 7.71838 14.8003 4.80339 14.1182 2.82484C14.0066 2.50027 14.1851 2.14774 14.5198 2.03747C14.8529 1.92876 15.2147 2.1027 15.3279 2.42883C16.0881 4.63411 15.9351 7.68267 15.9271 7.81157C15.9095 8.1439 15.6275 8.40016 15.2912 8.40016Z" fill="#FFA88B"/>
                <path d="M9.29976 7.46196C5.02838 7.46196 3.40429 6.1124 2.54206 5.03151C1.15386 3.29214 1.17139 1.21888 1.17299 1.13191C1.17777 0.872558 1.34671 0.642713 1.59853 0.555745C1.71009 0.51692 4.36217 -0.377612 7.10989 0.304158C10.2449 1.08066 11.8546 4.52679 11.9216 4.67276C12.065 4.98646 11.9216 5.35298 11.5996 5.49275C11.2777 5.63252 10.9015 5.49275 10.7581 5.17904C10.7406 5.14022 9.32366 2.1336 6.79749 1.50774C5.0507 1.07445 3.29115 1.39747 2.48309 1.59936C2.5548 2.20348 2.79069 3.31544 3.55253 4.26899C5.23717 6.37796 8.74672 6.3438 11.241 6.13259C12.1893 6.05184 12.8029 5.93381 12.8093 5.93225C13.1536 5.86392 13.4899 6.08134 13.56 6.41835C13.6301 6.7538 13.407 7.08147 13.0627 7.14981C13.0356 7.15603 12.3774 7.28337 11.351 7.37033C10.6083 7.43246 9.92772 7.46196 9.30454 7.46196H9.29976Z" fill="#FFA88B"/>
                <path d="M36.978 11.5438C37.4715 10.5069 38.2495 9.64917 39.3122 8.97049C40.3939 8.27296 41.6749 7.92421 43.1551 7.92421C44.5596 7.92421 45.8215 8.25412 46.9411 8.91394C48.0798 9.55491 48.9622 10.4787 49.5885 11.6852C50.2337 12.8729 50.5563 14.2585 50.5563 15.8421C50.5563 17.4256 50.2337 18.8206 49.5885 20.0272C48.9622 21.2338 48.0798 22.167 46.9411 22.8267C45.8215 23.4865 44.5596 23.8165 43.1551 23.8165C41.6939 23.8165 40.4224 23.4771 39.3407 22.7985C38.259 22.1009 37.4715 21.2338 36.978 20.1969V30.886H35.0138V8.15043H36.978V11.5438ZM48.5352 15.8421C48.5352 14.5601 48.279 13.4573 47.7666 12.5335C47.2733 11.5909 46.5901 10.8745 45.7171 10.3844C44.8442 9.89425 43.8573 9.64917 42.7566 9.64917C41.6939 9.64917 40.7166 9.90367 39.8246 10.4127C38.9518 10.9217 38.259 11.6475 37.7466 12.5901C37.2342 13.5327 36.978 14.6261 36.978 15.8703C36.978 17.1146 37.2342 18.208 37.7466 19.1506C38.259 20.0931 38.9518 20.819 39.8246 21.328C40.7166 21.837 41.6939 22.0915 42.7566 22.0915C43.8573 22.0915 44.8442 21.8464 45.7171 21.3563C46.5901 20.8473 47.2733 20.1214 47.7666 19.1789C48.279 18.2174 48.5352 17.1052 48.5352 15.8421ZM68.2852 15.0786C68.2852 15.7572 68.2661 16.2756 68.2282 16.6338H55.3331C55.3901 17.8026 55.6747 18.8019 56.1871 19.6313C56.6995 20.4608 57.3731 21.0924 58.2082 21.526C59.0431 21.9407 59.9541 22.1481 60.9409 22.1481C62.2313 22.1481 63.3131 21.837 64.1861 21.2149C65.0779 20.5928 65.6663 19.7538 65.951 18.6981H68.0574C67.6778 20.2063 66.8619 21.4411 65.6094 22.4026C64.3757 23.3451 62.8197 23.8165 60.9409 23.8165C59.4796 23.8165 58.1701 23.496 57.0126 22.855C55.8549 22.1952 54.944 21.2714 54.2799 20.0838C53.6346 18.8772 53.312 17.4728 53.312 15.8703C53.312 14.2679 53.6346 12.8634 54.2799 11.6569C54.925 10.4504 55.8265 9.52663 56.9842 8.88566C58.1417 8.24469 59.4607 7.92421 60.9409 7.92421C62.4212 7.92421 63.7116 8.24469 64.8123 8.88566C65.9319 9.52663 66.7859 10.3938 67.3743 11.4872C67.9815 12.5618 68.2852 13.7589 68.2852 15.0786ZM66.2641 15.022C66.283 13.872 66.0458 12.8917 65.5524 12.0811C65.0779 11.2704 64.4232 10.6578 63.5883 10.243C62.7532 9.82826 61.8423 9.62089 60.8555 9.62089C59.3753 9.62089 58.1132 10.0922 57.0696 11.0348C56.0257 11.9774 55.447 13.3065 55.3331 15.022H66.2641ZM71.0199 15.8421C71.0199 14.2585 71.333 12.8729 71.9593 11.6852C72.6044 10.4787 73.4868 9.55491 74.6066 8.91394C75.7453 8.25412 77.0262 7.92421 78.4495 7.92421C79.9298 7.92421 81.2011 8.26354 82.264 8.94222C83.3457 9.62089 84.1237 10.4881 84.5982 11.5438V8.15043H86.5908V23.5902H84.5982V20.1686C84.1047 21.2243 83.3172 22.1009 82.2355 22.7985C81.1727 23.4771 79.9013 23.8165 78.4211 23.8165C77.0166 23.8165 75.7453 23.4865 74.6066 22.8267C73.4868 22.167 72.6044 21.2338 71.9593 20.0272C71.333 18.8206 71.0199 17.4256 71.0199 15.8421ZM84.5982 15.8703C84.5982 14.6261 84.342 13.5327 83.8296 12.5901C83.3172 11.6475 82.615 10.9217 81.7231 10.4127C80.8501 9.90367 79.8823 9.64917 78.8196 9.64917C77.7188 9.64917 76.732 9.89425 75.8591 10.3844C74.9861 10.8745 74.2935 11.5909 73.7811 12.5335C73.2876 13.4573 73.041 14.5601 73.041 15.8421C73.041 17.1052 73.2876 18.2174 73.7811 19.1789C74.2935 20.1214 74.9861 20.8473 75.8591 21.3563C76.732 21.8464 77.7188 22.0915 78.8196 22.0915C79.8823 22.0915 80.8501 21.837 81.7231 21.328C82.615 20.819 83.3172 20.0931 83.8296 19.1506C84.342 18.208 84.5982 17.1146 84.5982 15.8703ZM90.2288 15.8703C90.2288 14.2679 90.5516 12.8729 91.1967 11.6852C91.842 10.4787 92.7338 9.55491 93.8725 8.91394C95.0111 8.25412 96.3111 7.92421 97.7723 7.92421C99.6892 7.92421 101.264 8.39551 102.498 9.33811C103.75 10.2807 104.557 11.5627 104.917 13.1839H102.782C102.517 12.0717 101.938 11.2045 101.046 10.5823C100.173 9.94137 99.0818 9.62089 97.7723 9.62089C96.7287 9.62089 95.7893 9.85653 94.9542 10.3278C94.1193 10.7991 93.4551 11.5061 92.9616 12.4487C92.4872 13.3724 92.2499 14.513 92.2499 15.8703C92.2499 17.2277 92.4872 18.3777 92.9616 19.3203C93.4551 20.2628 94.1193 20.9698 94.9542 21.4411C95.7893 21.9125 96.7287 22.1481 97.7723 22.1481C99.0818 22.1481 100.173 21.837 101.046 21.2149C101.938 20.5739 102.517 19.6879 102.782 18.5568H104.917C104.557 20.1403 103.75 21.4128 102.498 22.3743C101.245 23.3357 99.6701 23.8165 97.7723 23.8165C96.3111 23.8165 95.0111 23.496 93.8725 22.855C92.7338 22.1952 91.842 21.2714 91.1967 20.0838C90.5516 18.8772 90.2288 17.4728 90.2288 15.8703ZM115.999 7.86765C117.175 7.86765 118.228 8.11273 119.158 8.60288C120.107 9.09303 120.847 9.84711 121.379 10.8651C121.929 11.8643 122.204 13.0897 122.204 14.5413V23.5902H120.24V14.7675C120.24 13.0897 119.813 11.8077 118.959 10.9217C118.124 10.0356 116.976 9.59261 115.515 9.59261C114.015 9.59261 112.82 10.0639 111.928 11.0065C111.036 11.9491 110.59 13.3347 110.59 15.1634V23.5902H108.598V2.66449H110.59V10.7803C111.083 9.85653 111.805 9.14016 112.754 8.63116C113.721 8.12215 114.803 7.86765 115.999 7.86765Z" fill="black"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect fill="white" height="31" width="130"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        )}
        
        {/* Desktop collapse/expand button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full text-[#7f7f7f] transition-all duration-200 hover:bg-[#FFA88B]/10 hover:text-[#FFA88B] hover:scale-110 active:scale-95 ml-auto border border-transparent hover:border-[#FFA88B]/20"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
        
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 px-4 lg:px-6 space-y-1">
        <button 
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
            activeView === 'home' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Cases' : ''}
        >
          <FolderOpen className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Cases</span>}
        </button>

        <button 
          onClick={() => onNavigate('inbox')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors relative ${
            activeView === 'inbox' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Inbox' : ''}
        >
          <Inbox className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">Inbox</span>
              {totalCount > 0 && (
                <span className="text-sm text-[#7f7f7f]">{totalCount}</span>
              )}
            </>
          )}
          {isCollapsed && totalCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#FFA88B]" />
          )}
        </button>

        <button 
          onClick={() => onNavigate('sent')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
            activeView === 'sent' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Sent' : ''}
        >
          <Send className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Sent</span>}
        </button>

        <button 
          onClick={() => onNavigate('campaigns')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
            activeView === 'campaigns' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Campaigns' : ''}
        >
          <Megaphone className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Campaigns</span>}
        </button>

        <button 
          onClick={() => onNavigate('knowledge')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
            activeView === 'knowledge' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Knowledge Base' : ''}
        >
          <BookOpen className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Knowledge Base</span>}
        </button>

        <button 
          onClick={() => onNavigate('analytics')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
            activeView === 'analytics' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Analytics' : ''}
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Analytics</span>}
        </button>

        <button 
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
            activeView === 'settings' 
              ? 'bg-[#f2f3f5]' 
              : 'hover:bg-[#f2f3f5] text-[#7f7f7f]'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 lg:p-6 border-t border-black/10">
          <div className="min-w-0">
            <p className="font-medium truncate">Puneet Thiara</p>
            <p className="text-sm text-[#7f7f7f] truncate">pthiara@university.edu</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}