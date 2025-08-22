import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { SessionManager } from '../utils/secureStorage';

interface SecurityContextType {
  isSessionActive: boolean;
  sessionTimeout: number;
  sessionAge: number;
  refreshSession: () => void;
  endSession: () => void;
  showSecurityWarning: boolean;
  setShowSecurityWarning: (show: boolean) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
}) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(0);
  const [sessionAge, setSessionAge] = useState(0);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);

  const sessionManager = SessionManager.getInstance();

  // Check session status every minute
  useEffect(() => {
    const checkSession = () => {
      const isActive = sessionManager.isSessionActive();
      const sessionInfo = sessionManager.getSessionInfo();

      setIsSessionActive(isActive);
      setSessionTimeout(sessionManager.getSessionTimeout());
      setSessionAge(sessionInfo?.duration || 0);

      // Show warning when session is about to expire (5 minutes before)
      const warningThreshold = 5 * 60 * 1000; // 5 minutes
      if (
        sessionInfo &&
        sessionInfo.duration >
          sessionManager.getSessionTimeout() - warningThreshold
      ) {
        setShowSecurityWarning(true);
      } else {
        setShowSecurityWarning(false);
      }
    };

    // Initial check
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    // Check on user activity
    const handleUserActivity = () => {
      sessionManager.updateSessionActivity();
      checkSession();
    };

    // Add event listeners for user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, []);

  const refreshSession = () => {
    sessionManager.updateSessionActivity();
    const sessionInfo = sessionManager.getSessionInfo();
    setSessionAge(sessionInfo?.duration || 0);
    setShowSecurityWarning(false);
  };

  const endSession = () => {
    sessionManager.endSession();
    setIsSessionActive(false);
    setSessionAge(0);
    setShowSecurityWarning(false);
  };

  const value: SecurityContextType = {
    isSessionActive,
    sessionTimeout,
    sessionAge,
    refreshSession,
    endSession,
    showSecurityWarning,
    setShowSecurityWarning,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;


