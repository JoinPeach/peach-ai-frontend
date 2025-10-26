import { useState, useEffect } from 'react';
import { EmailPlatform } from './components/EmailPlatform';
import { LandingPageView } from './components/LandingPageView';
import { SignUpView } from './components/SignUpView';
import { OnboardingView } from './components/OnboardingView';

type AppState = 'landing' | 'signup' | 'onboarding' | 'app';

interface UserData {
  name: string;
  email: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('app'); // Skip signup, go directly to app
  const [userData, setUserData] = useState<UserData | null>(null);
  const [onboardingFiles, setOnboardingFiles] = useState<File[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [initialView, setInitialView] = useState<'home' | 'inbox'>('home');

  // Clear session data on mount for demo - always start fresh
  useEffect(() => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('initial_view');
  }, []);

  if (appState === 'landing') {
    return (
      <LandingPageView
        onLogin={() => setAppState('app')}
        onRequestDemo={() => {
          // Handle demo request
          console.log('Demo requested');
        }}
      />
    );
  }

  // Signup temporarily hidden
  // if (appState === 'signup') {
  //   return (
  //     <SignUpView
  //       onSignUp={(data) => {
  //         setUserData({ name: data.name, email: data.email });
  //         localStorage.setItem('user_data', JSON.stringify({ name: data.name, email: data.email }));
  //         // Skip onboarding, go directly to app
  //         setAppState('app');
  //       }}
  //       onSwitchToLogin={() => setAppState('app')}
  //     />
  //   );
  // }

  // Onboarding temporarily hidden
  // if (appState === 'onboarding' && userData) {
  //   return (
  //     <OnboardingView
  //       userName={userData.name}
  //       onComplete={(uploadedFiles, navigateTo) => {
  //         if (uploadedFiles && uploadedFiles.length > 0) {
  //           setOnboardingFiles(uploadedFiles);
  //         }
  //         // Set the initial view based on onboarding completion
  //         if (navigateTo) {
  //           setInitialView(navigateTo);
  //           localStorage.setItem('initial_view', navigateTo);
  //         }
  //         // Mark onboarding as completed
  //         localStorage.setItem('onboarding_completed', 'true');
  //         setAppState('app');
  //       }}
  //       onCancel={() => {
  //         // Clear session and return to signup
  //         localStorage.removeItem('user_data');
  //         localStorage.removeItem('onboarding_completed');
  //         setAppState('signup');
  //       }}
  //     />
  //   );
  // }

  return (
    <div className="size-full">
      <EmailPlatform 
        onLogoClick={() => setAppState('landing')} 
        initialKnowledgeBaseFiles={onboardingFiles}
        initialView={initialView}
      />
    </div>
  );
}