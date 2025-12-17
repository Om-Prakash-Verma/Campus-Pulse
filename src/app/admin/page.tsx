
"use client";

import { useState, useEffect } from "react";
import { type SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import Auth from "@/components/admin/Auth";
import Dashboard from "@/components/admin/Dashboard";
import { type LoginSchema, type RegisterSchema } from "@/components/admin/schemas";
import { type Club } from "@/lib/types";
import { useData } from "@/hooks/use-data";

const AUTH_SESSION_KEY = "campus-pulse-auth-club";

// Helper to dispatch a custom event
const dispatchLoginChange = () => {
  window.dispatchEvent(new CustomEvent('loginChange'));
};

export default function AdminPage() {
  const { toast } = useToast();
  const [loggedInClub, setLoggedInClub] = useState<Club | null>(null);
  const { clubs, loading, setClubs } = useData();

  useEffect(() => {
    const clubData = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (clubData) {
      const currentClub = JSON.parse(clubData);
      setLoggedInClub(currentClub);
      dispatchLoginChange();
    }
  }, []);

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

  const handleRegister: SubmitHandler<RegisterSchema> = (data) => {
    if (clubs.some(c => c.name === data.name)) {
      toast({ variant: "destructive", title: "Registration Failed", description: "Club name already exists." });
      return;
    }
    const newClub: Club = { 
      id: data.name.toLowerCase().replace(/\s/g, '-'), 
      slug: slugify(data.name),
      ...data ,
      description: `Welcome to ${data.name}! We are a new club focused on ${data.category}. Join us to learn more.`,
      leaders: [],
      members: [],
      expenses: [],
    };
    const updatedClubs = [...clubs, newClub];
    setClubs(updatedClubs);
    setLoggedInClub(newClub);
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newClub));
    dispatchLoginChange();
    toast({ title: "Registration Successful", description: `Welcome, ${newClub.name}!` });
  };

  const handleLogout = () => {
    setLoggedInClub(null);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    dispatchLoginChange();
    toast({ title: "Logged Out" });
  };
  
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-xl">Loading admin...</div>
      </div>
    );
  }

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

  return (
    <Dashboard
        club={loggedInClub}
        onLogout={handleLogout}
        setLoggedInClub={setLoggedInClub}
    />
  );
}
