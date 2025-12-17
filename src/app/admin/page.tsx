// Indicates that this file is a client-side component in Next.js.
"use client";

// Import necessary hooks and components from React and other modules.
import { useState, useEffect } from "react";
import { type SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import Auth from "@/components/admin/Auth";
import Dashboard from "@/components/admin/Dashboard";
import { type LoginSchema, type RegisterSchema } from "@/components/admin/schemas";
import { type Club } from "@/lib/types";
import { useData } from "@/hooks/use-data";

// Key for storing club authentication data in session storage.
const AUTH_SESSION_KEY = "campus-pulse-auth-club";

/**
 * Helper function to dispatch a custom \'loginChange\' event.
 * This allows other components to listen for changes in the login state.
 */
const dispatchLoginChange = () => {
  window.dispatchEvent(new CustomEvent('loginChange'));
};

/**
 * The main component for the admin page.
 * It handles club authentication (login, registration, logout) and
 * renders either the authentication form or the club dashboard.
 */
export default function AdminPage() {
  const { toast } = useToast();
  // State to hold the currently logged-in club, if any.
  const [loggedInClub, setLoggedInClub] = useState<Club | null>(null);
  // Custom hook to fetch and manage club data.
  const { clubs, loading, setClubs } = useData();

  // On component mount, check session storage to see if a club is already logged in.
  useEffect(() => {
    const clubData = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (clubData) {
      const currentClub = JSON.parse(clubData);
      setLoggedInClub(currentClub);
      dispatchLoginChange(); // Notify other components of login state.
    }
  }, []);

  /**
   * Handles the login form submission.
   * Finds a club with matching credentials and updates the login state.
   * @param data - The login form data.
   */
  const handleLogin: SubmitHandler<LoginSchema> = (data) => {
    const club = clubs.find(c => c.name === data.name && c.password === data.password);
    if (club) {
      setLoggedInClub(club);
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(club));
      dispatchLoginChange();
      toast({ title: "Login Successful", description: `Welcome, ${club.name}!` });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Incorrect club name or password.",
      });
    }
  };

  /**
   * Handles the registration form submission.
   * Creates a new club, updates the club list, and sets the new club as logged in.
   * @param data - The registration form data.
   */
  const handleRegister: SubmitHandler<RegisterSchema> = (data) => {
    // Check if a club with the same name already exists.
    if (clubs.some(c => c.name === data.name)) {
      toast({ variant: "destructive", title: "Registration Failed", description: "Club name already exists." });
      return;
    }
    // Create a new club object.
    const newClub: Club = { 
      id: data.name.toLowerCase().replace(/\s/g, '-'), 
      slug: slugify(data.name),
      ...data ,
      description: `Welcome to ${data.name}! We are a new club focused on ${data.category}. Join us to learn more.`,
      leaders: [],
      members: [],
      expenses: [],
    };
    // Update the list of clubs and set the new club as logged in.
    const updatedClubs = [...clubs, newClub];
    setClubs(updatedClubs);
    setLoggedInClub(newClub);
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newClub));
    dispatchLoginChange();
    toast({ title: "Registration Successful", description: `Welcome, ${newClub.name}!` });
  };

  /**
   * Handles the logout process.
   * Clears the logged-in club state and removes the session storage item.
   */
  const handleLogout = () => {
    setLoggedInClub(null);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    dispatchLoginChange();
    toast({ title: "Logged Out" });
  };
  
  // If club data is still loading, display a loading message.
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-xl">Loading admin...</div>
      </div>
    );
  }

  // If no club is logged in, display the authentication component.
  if (!loggedInClub) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Auth 
            clubs={clubs}
            onLogin={handleLogin}
            onRegister={handleRegister}
        />
      </div>
    );
  }

  // If a club is logged in, display the dashboard.
  return (
    <Dashboard
        club={loggedInClub}
        onLogout={handleLogout}
        setLoggedInClub={setLoggedInClub}
    />
  );
}