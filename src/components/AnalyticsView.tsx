import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, MessagesSquare, Clock, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsViewProps {
  onOpenMobileMenu?: () => void;
}

type TimePeriod = 'Last 7 Days' | 'Last 30 Days' | 'Last 60 Days' | 'Last 90 Days';

const analyticsData = {
  'Last 7 Days': {
    totalMessages: 550,
    totalReplies: 132,
    avgResponseTime: '2 minutes',
    aiEdited: '8%',
    chartData: [
      { date: 'Oct 9', messages: 45 },
      { date: 'Oct 10', messages: 68 },
      { date: 'Oct 11', messages: 52 },
      { date: 'Oct 12', messages: 85 },
      { date: 'Oct 13', messages: 62 },
      { date: 'Oct 14', messages: 71 },
      { date: 'Oct 15', messages: 48 },
    ],
    topics: [
      { label: 'FAFSA & CSS Profile', value: 130, percent: 100 },
      { label: 'Grants & Loans', value: 108, percent: 83 },
      { label: 'Verification', value: 91, percent: 70 },
      { label: 'Academic Progress', value: 91, percent: 70 },
      { label: 'Work-Study Jobs', value: 75, percent: 58 },
      { label: 'Other', value: 55, percent: 42 },
    ],
    teamActivity: [
      { edited: 120, approved: 140 },
      { edited: 200, approved: 150 },
      { edited: 200, approved: 150 },
      { edited: 200, approved: 150 },
      { edited: 65, approved: 215 },
      { edited: 65, approved: 215 },
      { edited: 60, approved: 50 },
    ],
  },
  'Last 30 Days': {
    totalMessages: 2340,
    totalReplies: 612,
    avgResponseTime: '3 minutes',
    aiEdited: '6%',
    chartData: [
      { date: 'Sep 16', messages: 320 },
      { date: 'Sep 19', messages: 420 },
      { date: 'Sep 22', messages: 380 },
      { date: 'Sep 25', messages: 450 },
      { date: 'Sep 28', messages: 490 },
      { date: 'Oct 1', messages: 520 },
      { date: 'Oct 4', messages: 580 },
      { date: 'Oct 7', messages: 650 },
      { date: 'Oct 10', messages: 610 },
      { date: 'Oct 13', messages: 690 },
    ],
    topics: [
      { label: 'FAFSA & CSS Profile', value: 580, percent: 100 },
      { label: 'Grants & Loans', value: 465, percent: 80 },
      { label: 'Verification', value: 395, percent: 68 },
      { label: 'Academic Progress', value: 350, percent: 60 },
      { label: 'Work-Study Jobs', value: 325, percent: 56 },
      { label: 'Other', value: 225, percent: 39 },
    ],
    teamActivity: [
      { edited: 250, approved: 280 },
      { edited: 180, approved: 240 },
      { edited: 220, approved: 260 },
      { edited: 190, approved: 270 },
      { edited: 140, approved: 260 },
      { edited: 160, approved: 250 },
      { edited: 150, approved: 180 },
    ],
  },
  'Last 60 Days': {
    totalMessages: 4850,
    totalReplies: 1285,
    avgResponseTime: '4 minutes',
    aiEdited: '5%',
    chartData: [
      { date: 'Aug 17', messages: 620 },
      { date: 'Aug 22', messages: 720 },
      { date: 'Aug 27', messages: 820 },
      { date: 'Sep 1', messages: 780 },
      { date: 'Sep 6', messages: 850 },
      { date: 'Sep 11', messages: 930 },
      { date: 'Sep 16', messages: 890 },
      { date: 'Sep 21', messages: 1050 },
      { date: 'Sep 26', messages: 980 },
      { date: 'Oct 1', messages: 1150 },
      { date: 'Oct 6', messages: 1020 },
      { date: 'Oct 11', messages: 900 },
    ],
    topics: [
      { label: 'FAFSA & CSS Profile', value: 1210, percent: 100 },
      { label: 'Grants & Loans', value: 970, percent: 80 },
      { label: 'Verification', value: 850, percent: 70 },
      { label: 'Academic Progress', value: 730, percent: 60 },
      { label: 'Work-Study Jobs', value: 680, percent: 56 },
      { label: 'Other', value: 410, percent: 34 },
    ],
    teamActivity: [
      { edited: 280, approved: 290 },
      { edited: 260, approved: 270 },
      { edited: 275, approved: 280 },
      { edited: 240, approved: 285 },
      { edited: 210, approved: 275 },
      { edited: 230, approved: 265 },
      { edited: 220, approved: 240 },
    ],
  },
  'Last 90 Days': {
    totalMessages: 7320,
    totalReplies: 1952,
    avgResponseTime: '5 minutes',
    aiEdited: '4%',
    chartData: [
      { date: 'Jul 18', messages: 650 },
      { date: 'Jul 25', messages: 720 },
      { date: 'Aug 1', messages: 850 },
      { date: 'Aug 8', messages: 920 },
      { date: 'Aug 15', messages: 880 },
      { date: 'Aug 22', messages: 980 },
      { date: 'Aug 29', messages: 1050 },
      { date: 'Sep 5', messages: 1100 },
      { date: 'Sep 12', messages: 1020 },
      { date: 'Sep 19', messages: 1150 },
      { date: 'Sep 26', messages: 1200 },
      { date: 'Oct 3', messages: 1180 },
      { date: 'Oct 10', messages: 1250 },
    ],
    topics: [
      { label: 'FAFSA & CSS Profile', value: 1830, percent: 100 },
      { label: 'Grants & Loans', value: 1465, percent: 80 },
      { label: 'Verification', value: 1282, percent: 70 },
      { label: 'Academic Progress', value: 1098, percent: 60 },
      { label: 'Work-Study Jobs', value: 1025, percent: 56 },
      { label: 'Other', value: 620, percent: 34 },
    ],
    teamActivity: [
      { edited: 290, approved: 295 },
      { edited: 285, approved: 290 },
      { edited: 280, approved: 285 },
      { edited: 275, approved: 290 },
      { edited: 260, approved: 285 },
      { edited: 270, approved: 280 },
      { edited: 265, approved: 275 },
    ],
  },
};

export function AnalyticsView({ onOpenMobileMenu }: AnalyticsViewProps = {}) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Last 7 Days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentData = analyticsData[selectedPeriod];

  // Calculate max value for Team Activity chart to determine height
  const maxTeamActivityValue = Math.max(
    ...currentData.teamActivity.map(item => item.approved + item.edited)
  );
  const teamActivityScale = Math.ceil(maxTeamActivityValue / 100) * 100; // Round up to nearest 100
  const teamActivityHeight = Math.max(280, (maxTeamActivityValue / teamActivityScale) * 400 + 80); // Dynamic height with minimum

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
    <div className="flex-1 bg-white p-3 sm:p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-[1148px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center gap-2">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-lg sm:text-xl lg:text-2xl">Analytics</h2>
          </div>
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full sm:w-auto gap-2 bg-[rgba(0,0,0,0.04)] px-3 sm:px-4 py-2 rounded-xl hover:bg-[rgba(0,0,0,0.06)] transition-colors text-sm sm:text-base"
            >
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#e7e7e7] rounded-3xl shadow-sm z-10 py-2">
                {(['Last 7 Days', 'Last 30 Days', 'Last 60 Days', 'Last 90 Days'] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-[#f9f9fa] transition-colors first:rounded-t-3xl last:rounded-b-3xl ${
                      selectedPeriod === period ? 'bg-[rgba(0,0,0,0.04)] text-black' : 'text-[#7f7f7f]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          <div className="border border-[#e7e7e7] rounded-3xl p-4 sm:p-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mb-3 sm:mb-5 text-[#011f5b]" viewBox="0 0 20 20" fill="none">
              <path d="M18.125 9.6875C18.1227 11.7588 17.2989 13.7446 15.8343 15.2093C14.3696 16.6739 12.3838 17.4977 10.3125 17.5H3.72422C3.39966 17.4996 3.08852 17.3705 2.85902 17.141C2.62953 16.9115 2.50041 16.6003 2.5 16.2758V9.6875C2.5 7.6155 3.3231 5.62836 4.78823 4.16323C6.25336 2.6981 8.2405 1.875 10.3125 1.875C12.3845 1.875 14.3716 2.6981 15.8368 4.16323C17.3019 5.62836 18.125 7.6155 18.125 9.6875ZM16.875 9.6875C16.875 7.94702 16.1836 6.27782 14.9529 5.04711C13.7222 3.8164 12.053 3.125 10.3125 3.125C8.57202 3.125 6.90282 3.8164 5.67211 5.04711C4.4414 6.27782 3.75 7.94702 3.75 9.6875V16.25H10.3125C12.0524 16.2481 13.7205 15.5561 14.9508 14.3258C16.1811 13.0955 16.8731 11.4274 16.875 9.6875Z" fill="currentColor"/>
            </svg>
            <div className="text-2xl sm:text-3xl lg:text-[40px] leading-6 mb-3 sm:mb-5">{currentData.totalMessages.toLocaleString()}</div>
            <div className="text-[#1e1919] text-sm sm:text-base">Total messages</div>
          </div>

          <div className="border border-[#e7e7e7] rounded-3xl p-4 sm:p-6">
            <MessagesSquare className="w-4 h-4 sm:w-5 sm:h-5 mb-3 sm:mb-5 text-[#011f5b]" />
            <div className="text-2xl sm:text-3xl lg:text-[40px] leading-6 mb-3 sm:mb-5">{currentData.totalReplies.toLocaleString()}</div>
            <div className="text-[#1e1919] text-sm sm:text-base">Total replies</div>
          </div>

          <div className="border border-[#e7e7e7] rounded-3xl p-4 sm:p-6">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mb-3 sm:mb-5 text-[#011f5b]" />
            <div className="text-2xl sm:text-3xl lg:text-[40px] leading-6 mb-3 sm:mb-5">{currentData.avgResponseTime}</div>
            <div className="text-[#1e1919] text-sm sm:text-base">Average response time</div>
          </div>

          <div className="border border-[#e7e7e7] rounded-3xl p-4 sm:p-6">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mb-3 sm:mb-5 text-[#011f5b]" />
            <div className="text-2xl sm:text-3xl lg:text-[40px] leading-6 mb-3 sm:mb-5">{currentData.aiEdited}</div>
            <div className="text-[#1e1919] text-sm sm:text-base">AI messages edited</div>
          </div>
        </div>

        {/* Chart: AI-generated messages sent */}
        <div className="border border-[#e7e7e7] rounded-3xl p-4 sm:p-6 mb-8 sm:mb-12">
          <h3 className="text-base sm:text-lg lg:text-xl text-[#11263c] mb-4 sm:mb-6">AI-generated messages sent</h3>
          
          {/* Chart area */}
          <div className="h-[200px] sm:h-[250px] lg:h-[280px] overflow-x-auto">
            <div style={{ minWidth: `${Math.max(320, currentData.chartData.length * 80)}px`, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentData.chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFA88B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FFA88B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#ece9f1" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#1e1919', fontSize: 15 }}
                    dy={10}
                  />
                  <YAxis 
                    hide={true}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e7e7e7',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#11263c', marginBottom: '4px' }}
                    itemStyle={{ color: '#FFA88B' }}
                    formatter={(value: number) => [`${value} messages`, '']}
                    cursor={{ stroke: '#FFA88B', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#FFA88B" 
                    strokeWidth={3}
                    strokeOpacity={0.87}
                    fill="url(#colorMessages)" 
                    activeDot={{ r: 6, fill: '#FFA88B', stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Topics Chart */}
        <div className="bg-[#f9f9fa] rounded-3xl p-6 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg text-[#11263c]">Topics</h3>
            <h3 className="text-lg text-[#11263c]">Messages</h3>
          </div>

          <div className="space-y-6">
            {currentData.topics.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-[180px] text-sm text-black">{item.label}</div>
                <div className="flex-1 h-4 bg-transparent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ffa88b] rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-black">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Member Activity */}
        <div className="bg-[#f9f9fa] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg text-[#11263c]">Team Member Activity</h3>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-[#ffecbd] rounded-xl text-black">Edited</span>
              <span className="px-4 py-2 bg-[#cdf4d4] rounded-xl text-black">Approved without edits</span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative" style={{ height: `${teamActivityHeight}px` }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-7 flex flex-col justify-between text-sm text-black text-right pr-2">
              <span>{teamActivityScale}</span>
              <span>{Math.round(teamActivityScale * 0.67)}</span>
              <span>{Math.round(teamActivityScale * 0.33)}</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="absolute left-8 right-0 top-0 bottom-7 flex items-end justify-between gap-16">
              {currentData.teamActivity.map((data, index) => {
                const maxHeight = teamActivityHeight - 28; // Container height minus label space
                const approvedHeight = (data.approved / teamActivityScale) * maxHeight;
                const editedHeight = (data.edited / teamActivityScale) * maxHeight;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col gap-px">
                      <div
                        className="w-full bg-[#cdf4d4] rounded-t-sm"
                        style={{ height: `${approvedHeight}px` }}
                      />
                      <div
                        className="w-full bg-[#ffecbd] rounded-b-sm"
                        style={{ height: `${editedHeight}px` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-sm text-black">
              <span>Debbie Reynolds</span>
              <span>Frank Mitchell</span>
              <span>Brittany Rider</span>
              <span>James Roy</span>
              <span>Janay Davis</span>
              <span>Chris Middleton</span>
              <span>Brenda Nelson</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}