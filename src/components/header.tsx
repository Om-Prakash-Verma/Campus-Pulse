"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { Drama } from 'lucide-react';
import { useEffect, useState } from 'react';

const AUTH_SESSION_KEY = "campus-pulse-auth-club";

export function AppHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // New state to prevent flicker

  useEffect(() => {
    const checkLoginStatus = () => {
      const clubData = sessionStorage.getItem(AUTH_SESSION_KEY);
      setIsLoggedIn(!!clubData);
      setIsAuthChecked(true); // Mark auth check as complete
    };

    // Check on initial mount
    checkLoginStatus();

    // Listen for custom event to re-check status
    const handleLoginChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('loginChange', handleLoginChange);

    // Standard storage event for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_SESSION_KEY) {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);


    return () => {
      window.removeEventListener('loginChange', handleLoginChange);
      window.removeEventListener('storage', 'handleStorageChange');
    };
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full glassmorphism">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Drama className="h-6 w-6 text-accent" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Campus Pulse
          </span>
        </Link>
        <nav>
          {isAuthChecked && (
            isLoggedIn ? (
              <Button asChild variant="ghost">
                <Link href="/admin">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/admin">Club Login</Link>
              </Button>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
