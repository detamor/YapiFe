import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google?: any;
  }
}

interface SocialLoginProps {
  onSuccessRedirect?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccessRedirect = '/' }) => {
  const { loginWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const googleBtnRef = React.useRef<HTMLDivElement>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Google Identity Services Integration
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGoogleScriptLoaded(true);
      setIsGoogleLoading(false);
      return;
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      const handleLoad = () => {
        setGoogleScriptLoaded(true);
        setIsGoogleLoading(false);
      };
      existingScript.addEventListener('load', handleLoad);
      return () => {
        existingScript.removeEventListener('load', handleLoad);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-gsi-client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleScriptLoaded(true);
      setIsGoogleLoading(false);
    };
    script.onerror = () => {
      setIsGoogleLoading(false);
      console.error('Gagal memuat Google Sign-In SDK');
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (googleScriptLoaded && googleBtnRef.current) {
      if (!googleClientId || googleClientId.includes('your_google_client_id')) {
        console.warn('Google Client ID is not configured or is a placeholder.');
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
      }
    }
  }, [googleScriptLoaded, googleClientId]);

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;

    setIsLoggingIn(true);
    const loadingToast = toast.loading('Masuk dengan Google...');
    try {
      await loginWithGoogle(response.credential);
      toast.success('Berhasil masuk dengan Google!', { id: loadingToast });
      window.location.href = onSuccessRedirect;
    } catch (error: any) {
      console.error('Google login failed:', error);
      const message = error.response?.data?.message || 'Gagal masuk menggunakan Google';
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="mt-6 w-full space-y-4">
      {/* Divider */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-xs font-sans uppercase tracking-wider">
          atau masuk dengan
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="w-full relative h-[40px]">
        {isGoogleLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse border border-gray-300 rounded flex items-center justify-center text-xs text-gray-400 font-sans">
            Memuat Google...
          </div>
        )}
        <div
          ref={googleBtnRef}
          id="google-signin-btn-container"
          className={`w-full ${isGoogleLoading || isLoggingIn ? 'pointer-events-none opacity-60' : ''}`}
        ></div>
      </div>
    </div>
  );
};

export default SocialLogin;
