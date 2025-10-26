import { useState, useEffect } from 'react';
import { Menu, Check, Loader2 } from 'lucide-react';

type SettingsTab = 'profile' | 'team' | 'email' | 'billing';

interface SettingsViewProps {
  onOpenMobileMenu?: () => void;
  initialTab?: string;
}

export function SettingsView({ onOpenMobileMenu, initialTab }: SettingsViewProps = {}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>((initialTab as SettingsTab) || 'profile');

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-[#c4c4c4]">
        <div className="flex items-center gap-2 mb-4 lg:mb-6">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl lg:text-2xl">Settings</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1 text-[13px] rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-[rgba(0,0,0,0.15)] shadow-[0px_0px_2px_0px_inset_rgba(0,0,0,0.1),0px_1px_1px_0px_inset_rgba(0,0,0,0.1)]'
                : 'hover:bg-gray-100'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1 text-[13px] rounded-lg transition-colors ${
              activeTab === 'team'
                ? 'bg-[rgba(0,0,0,0.15)] shadow-[0px_0px_2px_0px_inset_rgba(0,0,0,0.1),0px_1px_1px_0px_inset_rgba(0,0,0,0.1)]'
                : 'hover:bg-gray-100'
            }`}
          >
            Team Management
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1 text-[13px] rounded-lg transition-colors ${
              activeTab === 'email'
                ? 'bg-[rgba(0,0,0,0.15)] shadow-[0px_0px_2px_0px_inset_rgba(0,0,0,0.1),0px_1px_1px_0px_inset_rgba(0,0,0,0.1)]'
                : 'hover:bg-gray-100'
            }`}
          >
            Email Integration
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`hidden px-3 py-1 text-[13px] rounded-lg transition-colors ${
              activeTab === 'billing'
                ? 'bg-[rgba(0,0,0,0.15)] shadow-[0px_0px_2px_0px_inset_rgba(0,0,0,0.1),0px_1px_1px_0px_inset_rgba(0,0,0,0.1)]'
                : 'hover:bg-gray-100'
            }`}
          >
            Billing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'profile' && <MyProfileTab />}
        {activeTab === 'team' && <TeamManagementTab />}
        {activeTab === 'email' && <EmailIntegrationTab />}
        {activeTab === 'billing' && <BillingTab />}
      </div>
    </div>
  );
}

function MyProfileTab() {
  // Try to get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        const nameParts = parsed.name?.split(' ') || [];
        return {
          email: parsed.email || 'pthiara@university.edu',
          firstName: nameParts[0] || 'Puneet',
          lastName: nameParts.slice(1).join(' ') || 'Thiara',
          organization: 'The University',
          streetAddress: '1234 Broadway Ln',
          zipCode: '101900',
          city: 'New York',
          state: 'New York',
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    return {
      email: 'pthiara@university.edu',
      firstName: 'Puneet',
      lastName: 'Thiara',
      organization: 'The University',
      streetAddress: '1234 Broadway Ln',
      zipCode: '101900',
      city: 'New York',
      state: 'New York',
    };
  };

  const [savedProfile, setSavedProfile] = useState(getUserData());
  const [formData, setFormData] = useState(savedProfile);

  // Check if any field has changed
  const hasChanges = Object.keys(formData).some(
    (key) => formData[key as keyof typeof formData] !== savedProfile[key as keyof typeof savedProfile]
  );

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = () => {
    if (hasChanges) {
      setSavedProfile(formData);
    }
  };

  return (
    <div className="max-w-[827px] mt-2">
      <div className="space-y-6">
        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-[#212121]">Email address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <label className="text-[#212121]">First name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-[#212121]">Last name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <label className="text-[#212121]">Organization</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <label className="text-[#212121]">Street address</label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <label className="text-[#212121]">Zip code</label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-[#212121]">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className="text-[#212121]">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            onClick={handleUpdateProfile}
            disabled={!hasChanges}
            className={`px-4 py-2.5 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all ${
              hasChanges 
                ? 'bg-[#3c4043] text-white hover:bg-[#2c2e31] cursor-pointer' 
                : 'bg-[rgba(60,64,67,0.2)] text-white opacity-50 cursor-not-allowed'
            }`}
          >
            Update my profile
          </button>
          
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                // Clear all session data
                localStorage.removeItem('user_data');
                localStorage.removeItem('onboarding_completed');
                // Reload the page to return to sign-up
                window.location.reload();
              }
            }}
            className="px-4 py-2.5 rounded-lg border border-[#7f7f7f] text-[#3c4043] hover:bg-gray-50 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamManagementTab() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Editor' | 'Admin'>('Editor');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<string | null>(null);
  
  const [members, setMembers] = useState([
    { name: 'Puneet Thiara', email: 'pthiara@university.edu', role: 'Owner', status: 'Active', dateJoined: '9/25/2025' },
    { name: 'Marius Chawa', email: 'mchawa@university.edu', role: 'Admin', status: 'Pending', dateJoined: '' },
  ]);

  const handleInvite = () => {
    if (inviteEmail.trim() && inviteEmail.includes('@')) {
      const newMember = {
        name: inviteEmail.split('@')[0], // Use email prefix as temporary name
        email: inviteEmail,
        role: selectedRole,
        status: 'Pending',
        dateJoined: '',
      };
      
      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setSelectedRole('Editor');
    }
  };

  const handleSelectMember = (email: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === members.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(members.map(m => m.email)));
    }
  };

  const handleDeleteSelected = () => {
    setMembers(prev => prev.filter(m => !selectedMembers.has(m.email)));
    setSelectedMembers(new Set());
  };

  const handleChangeRole = (email: string, newRole: string) => {
    setMembers(prev => prev.map(m => 
      m.email === email ? { ...m, role: newRole } : m
    ));
    setRoleDropdownOpen(null);
  };

  const isValidEmail = inviteEmail.trim().length > 0 && inviteEmail.includes('@');

  return (
    <div className="max-w-[1100px] mt-2">
      {/* Invite Section */}
      <div className="mb-8 space-y-2">
        <label className="text-[#212121]">Invite new members</label>
        <div className="flex items-center gap-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Add emails"
            className="flex-1 px-4 py-4 border border-[#7f7f7f] rounded-xl outline-none focus:border-black transition-colors"
          />
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#7f7f7f] rounded-lg text-[#212121] bg-white hover:border-black transition-colors min-w-[120px]"
            >
              <span>{selectedRole}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showRoleDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white border border-[#7f7f7f] rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setSelectedRole('Editor');
                    setShowRoleDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-100 transition-colors"
                >
                  Editor
                </button>
                <button
                  onClick={() => {
                    setSelectedRole('Admin');
                    setShowRoleDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-100 transition-colors"
                >
                  Admin
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={handleInvite}
            disabled={!isValidEmail}
            className={`px-4 py-2.5 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all ${
              isValidEmail 
                ? 'bg-[#3c4043] text-white hover:bg-[#2c2e31] cursor-pointer' 
                : 'bg-[rgba(60,64,67,0.2)] text-white opacity-50 cursor-not-allowed'
            }`}
          >
            Invite
          </button>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-[#212121]">Members</label>
          {selectedMembers.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#3c4043] text-white rounded-lg hover:bg-[#2c2e31] transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete ({selectedMembers.size})
            </button>
          )}
        </div>
        <div className="bg-[rgba(242,243,245,0.5)] px-3 py-2.5 rounded-lg flex items-center gap-2">
          <svg className="w-6 h-6 text-[#7f7f7f]" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[#7f7f7f]">Search for a member</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#eaecf0] rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fcfcfd]">
              <tr className="border-b border-[#eaecf0]">
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedMembers.size === members.length && members.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-1 text-sm text-[#667085]">
                  Member
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 3.33333V12.6667M8 12.6667L12.6667 8M8 12.6667L3.33333 8" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-1 text-sm text-[#667085]">
                  Email
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 3.33333V12.6667M8 12.6667L12.6667 8M8 12.6667L3.33333 8" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-1 text-sm text-[#667085]">
                  Role
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 3.33333V12.6667M8 12.6667L12.6667 8M8 12.6667L3.33333 8" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  Status
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 3.33333V12.6667M8 12.6667L12.6667 8M8 12.6667L3.33333 8" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-1 text-sm text-[#667085]">
                  Date Joined
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 3.33333V12.6667M8 12.6667L12.6667 8M8 12.6667L3.33333 8" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-b border-[#eaecf0]">
                <td className="px-4 py-3">
                  {member.role !== 'Owner' && (
                    <input
                      type="checkbox"
                      checked={selectedMembers.has(member.email)}
                      onChange={() => handleSelectMember(member.email)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  )}
                </td>
                <td className="px-6 py-3 text-[#101828]">{member.name}</td>
                <td className="px-6 py-3 text-[#667085] text-sm">{member.email}</td>
                <td className="px-6 py-3 relative">
                  {member.role === 'Owner' ? (
                    <span className="text-[#667085] text-sm">{member.role}</span>
                  ) : (
                    <div className="relative inline-block">
                      <button
                        onClick={() => setRoleDropdownOpen(roleDropdownOpen === member.email ? null : member.email)}
                        className="flex items-center gap-2 px-2 py-1 text-[#667085] text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        <span>{member.role}</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
                          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      {roleDropdownOpen === member.email && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-50 overflow-hidden min-w-[120px]">
                          <button
                            onClick={() => handleChangeRole(member.email, 'Editor')}
                            className="w-full px-4 py-2.5 text-left text-[#212121] hover:bg-gray-100 transition-colors text-sm"
                          >
                            Editor
                          </button>
                          <button
                            onClick={() => handleChangeRole(member.email, 'Admin')}
                            className="w-full px-4 py-2.5 text-left text-[#212121] hover:bg-gray-100 transition-colors text-sm"
                          >
                            Admin
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-3">
                  {member.status === 'Active' ? (
                    <span className="inline-flex items-center px-2 py-1 bg-[#f2f4f7] text-[#364254] text-xs rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-[#5f6369] text-white text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-[#667085] text-sm">{member.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function EmailIntegrationTab() {
  const [sharedAccounts, setSharedAccounts] = useState({
    financialaid: true,
    scholarships: true,
    workstudy: true,
    loans: true,
  });
  // Outlook integration removed - feature disabled

  const toggleAccount = (account: keyof typeof sharedAccounts) => {
    setSharedAccounts(prev => ({
      ...prev,
      [account]: !prev[account]
    }));
  };

  return (
    <div className="max-w-[1100px] mt-2">


      {/* Primary Account */}
      <div className="mb-6 pb-6 border-b border-[#ece9f1]">
        <h3 className="text-[#212121] mb-4">Primary Account</h3>
        <p className="text-[#7f7f7f]">pthiara@university.edu</p>
      </div>

      {/* Shared Accounts */}
      <div className="mb-8">
        <h3 className="text-[#212121] mb-4">Shared Accounts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#7f7f7f]">financialaid@university.edu</span>
            <button
              onClick={() => toggleAccount('financialaid')}
              className={`w-10 h-[22px] rounded-full relative transition-colors ${
                sharedAccounts.financialaid ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-[0px_2px_4px_0px_rgba(39,39,39,0.1)] transition-transform ${
                sharedAccounts.financialaid ? 'translate-x-[20px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[#7f7f7f]">scholarships@university.edu</span>
            <button
              onClick={() => toggleAccount('scholarships')}
              className={`w-10 h-[22px] rounded-full relative transition-colors ${
                sharedAccounts.scholarships ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-[0px_2px_4px_0px_rgba(39,39,39,0.1)] transition-transform ${
                sharedAccounts.scholarships ? 'translate-x-[20px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[#7f7f7f]">workstudy@university.edu</span>
            <button
              onClick={() => toggleAccount('workstudy')}
              className={`w-10 h-[22px] rounded-full relative transition-colors ${
                sharedAccounts.workstudy ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-[0px_2px_4px_0px_rgba(39,39,39,0.1)] transition-transform ${
                sharedAccounts.workstudy ? 'translate-x-[20px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[#7f7f7f]">loans@university.edu</span>
            <button
              onClick={() => toggleAccount('loans')}
              className={`w-10 h-[22px] rounded-full relative transition-colors ${
                sharedAccounts.loans ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-[0px_2px_4px_0px_rgba(39,39,39,0.1)] transition-transform ${
                sharedAccounts.loans ? 'translate-x-[20px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Connect Buttons */}
      <div className="space-y-4">
        <h3 className="text-[#212121] mb-4">Email Providers</h3>
        
        <div className="flex flex-wrap gap-4">
          {/* Outlook Connection - Disabled */}
          <button 
            disabled
            className="flex items-center gap-2 px-4 py-4 border border-[#e0e0e0] rounded-lg bg-gray-50 opacity-60 cursor-not-allowed"
          >
            <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
              <rect x="26" y="14" width="32" height="32" rx="2" fill="#0078D4"/>
              <rect x="26" y="14" width="32" height="16" fill="#0A2767"/>
              <rect x="26" y="14" width="16" height="16" fill="#28A8EA"/>
              <rect x="42" y="14" width="16" height="16" fill="#0078D4"/>
              <rect x="26" y="30" width="16" height="16" fill="#0078D4"/>
              <rect x="42" y="30" width="16" height="16" fill="#50D9FF"/>
              <path d="M26 14 L42 26 L58 14" fill="#0A2767" opacity="0.5"/>
              <path d="M26 14 L42 26 L58 14 L58 16 L42 28 L26 16 Z" fill="#1490DF"/>
              <rect x="6" y="22" width="28" height="28" rx="3" fill="#0364B8"/>
              <circle cx="20" cy="36" r="9" fill="none" stroke="white" strokeWidth="3"/>
            </svg>
            <span className="text-[#7f7f7f]">Connect Microsoft Outlook (Disabled)</span>
          </button>
          
          {/* Google Connection - Disabled */}
          <button 
            disabled
            className="flex items-center gap-2 px-4 py-4 border border-[#e0e0e0] rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
            <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            <span className="text-[#7f7f7f]">Connect Google (Disabled)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  const features = [
    { text: 'Lorem ipsum dolor sit', badge: false },
    { text: 'Lorem ipsum dolor sit', badge: false },
    { text: 'Lorem ipsum dolor', badge: false },
    { text: 'Lorem ipsum dolor sit', badge: false },
    { text: 'Lorem ipsum dolor sit amet', badge: false },
    { text: 'Lorem ipsum dolor sit amet', badge: false },
    { text: 'Lorem ipsum dolor sit', badge: true },
    { text: 'Lorem ipsum', badge: true },
    { text: 'Lorem ipsum dolor', badge: true },
  ];

  return (
    <div className="max-w-[1100px] mt-2">
      {/* Pricing Card */}
      <div className="inline-block">
        <div className="bg-white border-2 border-[#7f7f7f] rounded-lg p-10 max-w-[352px]">
          {/* Description */}
          <p className="text-sm text-black mb-7 opacity-80">
            Lorem ipsum dolor sit amet consectetur. Orci enim aliquam.
          </p>

          {/* Divider */}
          <div className="h-px bg-[#7f7f7f] opacity-30 mb-7" />

          {/* Price */}
          <div className="mb-2">
            <div className="text-[66px] leading-[73px] tracking-[-0.46px] text-[#000b33]">
              $150,000
            </div>
            <div className="text-sm text-black opacity-80 mt-1">
              per year
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#7f7f7f] opacity-30 mb-7" />

          {/* Features List */}
          <div className="space-y-3.5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1">
                {/* Checkmark Icon */}
                <svg className="w-[22px] h-[22px] shrink-0" viewBox="0 0 23 23" fill="none">
                  <path
                    d="M11.0781 2.76952C15.6668 2.76954 19.3867 6.48944 19.3867 11.0781C19.3867 15.6668 15.6668 19.3867 11.0781 19.3867C6.48944 19.3867 2.76954 15.6668 2.76952 11.0781C2.76952 6.48942 6.48942 2.76952 11.0781 2.76952ZM10.0928 12.4795L8.03807 10.4258L7.38475 11.0781L6.73241 11.7305L10.2168 15.2148L10.8642 14.4385L15.4795 8.8994L14.0615 7.71776L10.0928 12.4795Z"
                    fill="#141414"
                  />
                </svg>

                {/* Feature Text */}
                <span className="text-sm text-black">{feature.text}</span>

                {/* Coming Soon Badge */}
                {feature.badge && (
                  <span className="ml-1 px-1 py-0.5 bg-[#c9fad6] text-[#1aa703] text-[9px] rounded">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}