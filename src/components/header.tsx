"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { Drama } from 'lucide-react';
import { useEffect, useState } from 'react';

// Key for storing club authentication data in session storage.
const AUTH_SESSION_KEY = "campus-pulse-auth-club";

/**
 * The main application header.
 * Displays the app title and navigation links.
 * Shows "Dashboard" if a club is logged in, otherwise "Club Login".
 */
export function AppHeader() {
  // State to track if a club is logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to prevent UI flicker by waiting for the initial auth check.
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Checks session storage for club data to determine login status.
    const checkLoginStatus = () => {
      const clubData = sessionStorage.getItem(AUTH_SESSION_KEY);
      setIsLoggedIn(!!clubData);
      setIsAuthChecked(true); // Mark auth check as complete
    };

    // Check on initial component mount.
    checkLoginStatus();

    // Listens for a custom 'loginChange' event to re-check status.
    // This allows other components to trigger a re-render of the header.
    const handleLoginChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('loginChange', handleLoginChange);

    // Listens for storage events to sync login status across browser tabs.
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_SESSION_KEY) {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);


    // Cleanup: remove event listeners when the component unmounts.
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
          {/* Only render the button after the initial auth check is complete. */}
          {isAuthChecked && (
            isLoggedIn ? (
              // If logged in, show a link to the admin dashboard.
              <Button asChild variant="ghost">
                <Link href="/admin">Dashboard</Link>
              </Button>
            ) : (
              // If not logged in, show a link to the club login page.
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
