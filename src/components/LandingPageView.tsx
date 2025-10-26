import imgFavicon from "figma:asset/b2d691b03f466790687a493358e336e4f415edda.png";
import imgScreenshot20250812At114846Pm1 from "figma:asset/a6e89360590f0810f97cea55e49bc7e7c1df7e50.png";

interface LandingPageViewProps {
  onLogin?: () => void;
  onRequestDemo?: () => void;
}

export function LandingPageView({ onLogin, onRequestDemo }: LandingPageViewProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9">
                <img src={imgFavicon} alt="Peach" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl sm:text-2xl text-[#333333]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                peach
              </span>
            </div>

            <a
              href="mailto:puneet@joinpeach.co"
              className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-transparent rounded-lg transition-colors text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#212121] mb-4 sm:mb-6 leading-[1.1] tracking-tight">
              The AI Platform for Financial Aid Teams
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#666666] mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Peach builds personalized AI agents that automate student communications and operational tasks for financial aid offices.
            </p>
            <button
              onClick={onLogin}
              className="bg-[#F5B8A7] hover:bg-[#F3A693] text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-lg text-base sm:text-lg transition-all hover:shadow-lg"
            >
              Try the demo
            </button>
          </div>
        </div>
      </div>

      {/* Platform Preview */}


      {/* Features Section */}
      <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5B8A7]/20 rounded-xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5B8A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl text-[#212121] mb-3">AI-Powered Email</h3>
              <p className="text-base sm:text-lg text-[#666666] leading-relaxed">
                Generate intelligent, contextual responses to student emails in seconds
              </p>
            </div>

            <div className="text-center sm:text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5B8A7]/20 rounded-xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5B8A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl text-[#212121] mb-3">Analytics & Insights</h3>
              <p className="text-base sm:text-lg text-[#666666] leading-relaxed">
                Track performance metrics and optimize your communication strategy
              </p>
            </div>

            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5B8A7]/20 rounded-xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5B8A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl text-[#212121] mb-3">Knowledge Base</h3>
              <p className="text-base sm:text-lg text-[#666666] leading-relaxed">
                Train AI on your institution's policies and procedures for accurate responses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8">
                <img src={imgFavicon} alt="Peach" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg sm:text-xl text-[#666666]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                peach
              </span>
            </div>
            <div className="text-sm sm:text-base text-[#999999]">
              © 2025 Peach. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
