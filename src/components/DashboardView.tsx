import { Home, Mail, Megaphone, Clock, CheckCircle2, TrendingUp, Menu, ExternalLink, BookOpen, UserPlus, ChevronDown, ChevronUp, PlayCircle, GraduationCap, Newspaper, ArrowRight, Sparkles, Upload, Settings, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface DashboardViewProps {
  totalCases: number;
  totalSent: number;
  onNavigate: (view: 'inbox' | 'sent' | 'campaigns' | 'knowledge' | 'settings', settingsTab?: string) => void;
  onOpenMobileMenu?: () => void;
  userName: string;
}

export function DashboardView({ totalCases, totalSent, onNavigate, onOpenMobileMenu, userName }: DashboardViewProps) {
  const firstName = userName.split(' ')[0];
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const quickStartActions = [
    {
      title: 'Upload Knowledge',
      description: 'Add policies and docs to train the AI',
      icon: Upload,
      action: () => onNavigate('knowledge'),
    },
    {
      title: 'Create Campaign',
      description: 'Send bulk emails to multiple students',
      icon: Megaphone,
      action: () => onNavigate('campaigns'),
    },
    {
      title: 'Invite a Team Member',
      description: 'Add colleagues to collaborate on cases',
      icon: UserPlus,
      action: () => onNavigate('settings', 'team'),
    },
  ];

  const quickGuideSteps = [
    {
      step: 1,
      icon: Upload,
      title: 'Upload Knowledge',
      description: 'Add institutional policies and FAQs to train the AI on your specific financial aid guidelines.',
    },
    {
      step: 2,
      icon: MessageSquare,
      title: 'Review AI Responses',
      description: 'AI generates contextual responses based on your knowledge base. Review and edit before sending.',
    },
    {
      step: 3,
      icon: Sparkles,
      title: 'Send with Confidence',
      description: 'Send personalized, accurate responses to students. Track all communications in the audit log.',
    },
    {
      step: 4,
      icon: TrendingUp,
      title: 'Monitor Analytics',
      description: 'View response times, email volume, and team performance to optimize your workflow.',
    },
  ];

  const gettingStarted = [
    {
      step: 1,
      title: 'Connect Your Email',
      description: 'Link your institutional email to start receiving messages',
      longDescription: 'Connecting your email allows the AI platform to automatically import student inquiries and send responses on your behalf. This is the foundation of streamlining your financial aid communications.',
      completed: true,
      action: () => onNavigate('settings'),
      actionLabel: 'Go to Settings',
    },
    {
      step: 2,
      title: 'Upload Your Institutional Policies',
      description: 'Add your policies to the Knowledge Base to improve AI response accuracy',
      longDescription: 'Upload your institutional policies, procedures, and FAQs to help the AI generate more accurate and contextually relevant responses to student questions.',
      completed: false,
      action: () => onNavigate('knowledge'),
      actionLabel: 'Upload Documents',
    },
    {
      step: 3,
      title: 'Send Your First Response',
      description: 'Edit and send an AI-generated response to a student',
      longDescription: 'Review AI-suggested responses in your cases, make any necessary edits to match your tone, and send your first email to a student.',
      completed: false,
      action: () => onNavigate('inbox'),
      actionLabel: 'Check Cases',
    },
    {
      step: 4,
      title: 'Create a Campaign',
      description: 'Send bulk communications to multiple students at once',
      longDescription: 'Create targeted campaigns to send important announcements, reminders, or updates to multiple students simultaneously.',
      completed: false,
      action: () => onNavigate('campaigns'),
      actionLabel: 'Create Campaign',
    },
  ];
  
  const completedSteps = gettingStarted.filter(s => s.completed).length;
  const totalSteps = gettingStarted.length;

  return (
    <div className="flex flex-1 flex-col h-full bg-white overflow-hidden">
      {/* Mobile Menu Button */}
      {onOpenMobileMenu && (
        <div className="lg:hidden p-4 border-b border-black/10">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
          {/* Greeting */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-[24px]">Hi {firstName}, Welcome to Peach 👋</h1>
            <p className="text-[#7f7f7f] text-base sm:text-lg hidden">How would you like to start?</p>
          </div>

          {/* Quick Start Actions */}
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {quickStartActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-4 sm:p-6 rounded-xl border border-black/10 bg-white hover:border-black/20 hover:bg-[#fafafa] transition-all text-left group flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px]"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/5 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-black/10 transition-colors">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black/70" />
                    </div>
                    <h3 className="mb-1 text-center text-sm sm:text-base">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-[#7f7f7f] text-center">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Training Center */}
          <div className="mb-8 sm:mb-12">
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl">Training Center</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Training 1 */}
              <a 
                href="#"
                className="rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer overflow-hidden block"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#FFA88B]/20 to-[#FFA88B]/5 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-[#FFA88B]" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#7f7f7f]">45 minutes</span>
                    <span className="text-xs text-[#7f7f7f]">•</span>
                    <span className="text-xs text-[#7f7f7f]">Video Course</span>
                  </div>
                  <h3 className="mb-3 group-hover:text-black/70 transition-colors">
                    FAFSA Verification Process Fundamentals
                  </h3>
                  <p className="text-sm text-[#7f7f7f] mb-4 line-clamp-3">
                    Learn the essential steps of FAFSA verification, including required documentation, common issues, and best practices for efficient processing. Perfect for new financial aid counselors.
                  </p>
                  <div className="flex items-center gap-1 text-black text-sm group-hover:gap-2 transition-all">
                    <span>Start course</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>

              {/* Training 2 */}
              <a 
                href="#"
                className="rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer overflow-hidden block"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-blue-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#7f7f7f]">30 minutes</span>
                    <span className="text-xs text-[#7f7f7f]">•</span>
                    <span className="text-xs text-[#7f7f7f]">Reading Material</span>
                  </div>
                  <h3 className="mb-3 group-hover:text-black/70 transition-colors">
                    Professional Judgment and Circumstances
                  </h3>
                  <p className="text-sm text-[#7f7f7f] mb-4 line-clamp-3">
                    Comprehensive guide on exercising professional judgment for special circumstances, including loss of income, medical expenses, and dependent care. Includes real case examples.
                  </p>
                  <div className="flex items-center gap-1 text-black text-sm group-hover:gap-2 transition-all">
                    <span>View guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>

              {/* Training 3 */}
              <a 
                href="#"
                className="rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer overflow-hidden block"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-green-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#7f7f7f]">1 hour</span>
                    <span className="text-xs text-[#7f7f7f]">•</span>
                    <span className="text-xs text-[#7f7f7f]">Interactive Workshop</span>
                  </div>
                  <h3 className="mb-3 group-hover:text-black/70 transition-colors">
                    Communicating with Students and Families
                  </h3>
                  <p className="text-sm text-[#7f7f7f] mb-4 line-clamp-3">
                    Master the art of communicating complex financial aid information clearly and empathetically. Learn email templates, phone scripts, and de-escalation techniques.
                  </p>
                  <div className="flex items-center gap-1 text-black text-sm group-hover:gap-2 transition-all">
                    <span>Join workshop</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Getting Started Guide - Hidden */}
          <div className="hidden">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-[#7f7f7f]" />
              <p className="text-[#7f7f7f] text-sm">{completedSteps}/{totalSteps} tasks</p>
            </div>
            <h2 className="mb-6">Your first steps</h2>
            
            <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
              <div className="divide-y divide-black/10">
                {gettingStarted.map((item, index) => (
                  <div key={index} className="transition-all">
                    <button
                      onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                      className="w-full p-5 lg:p-6 flex items-start gap-4 hover:bg-[#f9f9f9] transition-colors text-left"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed 
                          ? 'bg-[#66BB6A] text-white' 
                          : 'bg-[#E3F2FD] text-[#42A5F5]'
                      }`}>
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="text-sm">{item.step}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={item.completed ? 'text-[#7f7f7f]' : ''}>
                          {item.title}
                        </h4>
                        <p className="text-[#7f7f7f] text-sm mt-1">{item.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedStep === index ? (
                          <ChevronUp className="w-5 h-5 text-[#7f7f7f]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#7f7f7f]" />
                        )}
                      </div>
                    </button>
                    
                    {expandedStep === index && (
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">
                        <div className="ml-12 pl-4 border-l-2 border-[#E3F2FD]">
                          <p className="text-sm text-[#7f7f7f] mb-4">
                            {item.longDescription}
                          </p>
                          {!item.completed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                              }}
                              className="px-4 py-2 bg-[#42A5F5] text-white rounded-lg hover:bg-[#1E88E5] transition-colors text-sm"
                            >
                              {item.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* Training Section */}
          <div className="hidden">
            <h2 className="mb-6">Training</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Module 1 */}
              <div className="rounded-lg border border-black/10 bg-white overflow-hidden hover:shadow-md hover:border-black/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden bg-[#f9f9f9] flex items-center justify-center relative border-b border-black/10">
                  <div className="absolute inset-0 opacity-10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGNvdXJzZXxlbnwxfHx8fDE3NjAzNzcyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Training"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                    <PlayCircle className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-black/5 text-black/60 text-xs rounded">Beginner</span>
                    <span className="text-xs text-[#7f7f7f]">25 min</span>
                  </div>
                  <h4 className="mb-2">FAFSA Fundamentals</h4>
                  <p className="text-xs text-[#7f7f7f] mb-3 line-clamp-2">
                    Learn the basics of the Free Application for Federal Student Aid and how to guide students through the process.
                  </p>
                  <div className="flex items-center gap-1 text-black text-xs group-hover:gap-2 transition-all">
                    <span>Start module</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Module 2 */}
              <div className="rounded-lg border border-black/10 bg-white overflow-hidden hover:shadow-md hover:border-black/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden bg-[#f9f9f9] flex items-center justify-center relative border-b border-black/10">
                  <div className="absolute inset-0 opacity-10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZmluYW5jaWFsJTIwYWlkJTIwb2ZmaWNlfGVufDF8fHx8MTc2MDM3NzI1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Training"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                    <PlayCircle className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-black/5 text-black/60 text-xs rounded">Intermediate</span>
                    <span className="text-xs text-[#7f7f7f]">45 min</span>
                  </div>
                  <h4 className="mb-2">Award Letter Communication</h4>
                  <p className="text-xs text-[#7f7f7f] mb-3 line-clamp-2">
                    Master effective strategies for explaining financial aid packages and award letters to students and families.
                  </p>
                  <div className="flex items-center gap-1 text-black text-xs group-hover:gap-2 transition-all">
                    <span>Start module</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Module 3 */}
              <div className="rounded-lg border border-black/10 bg-white overflow-hidden hover:shadow-md hover:border-black/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden bg-[#f9f9f9] flex items-center justify-center relative border-b border-black/10">
                  <div className="absolute inset-0 opacity-10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc2MDM3NzI1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Training"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                    <PlayCircle className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-black/5 text-black/60 text-xs rounded">Advanced</span>
                    <span className="text-xs text-[#7f7f7f]">60 min</span>
                  </div>
                  <h4 className="mb-2">Verification & Compliance</h4>
                  <p className="text-xs text-[#7f7f7f] mb-3 line-clamp-2">
                    Deep dive into verification procedures, documentation requirements, and regulatory compliance.
                  </p>
                  <div className="flex items-center gap-1 text-black text-xs group-hover:gap-2 transition-all">
                    <span>Start module</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Module 4 */}
              <div className="rounded-lg border border-black/10 bg-white overflow-hidden hover:shadow-md hover:border-black/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden bg-[#f9f9f9] flex items-center justify-center relative border-b border-black/10">
                  <div className="absolute inset-0 opacity-10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudCUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjAzNzcyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Training"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                    <PlayCircle className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-black/5 text-black/60 text-xs rounded">Intermediate</span>
                    <span className="text-xs text-[#7f7f7f]">35 min</span>
                  </div>
                  <h4 className="mb-2">Special Circumstances Appeals</h4>
                  <p className="text-xs text-[#7f7f7f] mb-3 line-clamp-2">
                    Handle complex cases involving special circumstances, professional judgment, and appeal processes.
                  </p>
                  <div className="flex items-center gap-1 text-black text-xs group-hover:gap-2 transition-all">
                    <span>Start module</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest News Section */}
          <div>
            <h2 className="mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <a 
                href="https://studentaid.gov/announcements-events/fafsa-support"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Newspaper className="w-5 h-5 text-black/70" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#7f7f7f]">Oct 10, 2025</span>
                </div>
                <h3 className="mb-2 group-hover:text-black/70 transition-colors">FAFSA Simplification Updates</h3>
                <p className="text-sm text-[#7f7f7f] leading-relaxed">New streamlined verification requirements for 2025-26 academic year.</p>
              </a>

              <a 
                href="https://www.nasfaa.org/news"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-black/70" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#7f7f7f]">Oct 8, 2025</span>
                </div>
                <h3 className="mb-2 group-hover:text-black/70 transition-colors">Pell Grant Award Increase</h3>
                <p className="text-sm text-[#7f7f7f] leading-relaxed">Maximum award increased to $7,895 for eligible students this year.</p>
              </a>

              <a 
                href="https://www.insidehighered.com/news/student-success"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-black/70" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#7f7f7f]">Oct 5, 2025</span>
                </div>
                <h3 className="mb-2 group-hover:text-black/70 transition-colors">First-Gen Student Support</h3>
                <p className="text-sm text-[#7f7f7f] leading-relaxed">Best practices for serving first-generation college students.</p>
              </a>

              <a 
                href="https://www.nasfaa.org/compliance"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl border border-black/10 bg-white hover:shadow-lg hover:border-black/20 hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                  <Settings className="w-5 h-5 text-black/70" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#7f7f7f]">Oct 1, 2025</span>
                </div>
                <h3 className="mb-2 group-hover:text-black/70 transition-colors">Compliance Updates</h3>
                <p className="text-sm text-[#7f7f7f] leading-relaxed">New federal regulations affecting financial aid administration.</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
