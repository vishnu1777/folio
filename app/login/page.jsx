'use client'; // Important: keep this at the very top
import React from "react"; // Add this import
import { useState } from 'react'; // Make sure you import useState
import { signIn } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  // Hooks must be called at the top level, not inside conditionals or loops
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const errorDescription = searchParams?.get('error_description');

  // Map error codes to user-friendly messages
  const errorMessages = {
    AccessDenied: "You don't have permission to access this page. Only authorized emails can log in.",
    Default: "An error occurred. Please try again.",
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn('google', {
      callbackUrl: '/dashboard'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Dashboard Login</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to access your portfolio dashboard
          </p>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            <p><strong>Error:</strong> {errorMessages[error] || error}</p>
            {errorDescription && <p><strong>Details:</strong> {errorDescription}</p>}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <FaGoogle />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Only authorized emails can access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}