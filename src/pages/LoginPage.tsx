import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  getAdditionalUserInfo,
  deleteUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  async function handleGoogleSignIn() {
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);

      if (getAdditionalUserInfo(result)?.isNewUser) {
        await deleteUser(result.user);
        setError('Access restricted. Only existing users can sign in.');
        return;
      }
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    }
  }

  return (
    <div className="bg-bg flex h-dvh items-center justify-center">
      <div className="bg-surface border-border w-90 rounded-2xl border p-12 text-center shadow-2xl">
        <div className="mb-4">
          <img src="/favicon.svg" alt="My Mind" className="mx-auto h-12 w-12" />
        </div>

        <h1 className="text-text mt-0 mb-2 text-3xl font-bold">My Mind</h1>
        <p className="text-muted mt-0 mb-8 text-base">Infrastructure Map</p>

        <button
          className="bg-surface-2 border-border text-text hover:bg-surface hover:border-primary flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-150"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        {error && <p className="text-danger mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
