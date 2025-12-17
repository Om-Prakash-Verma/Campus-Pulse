// Indicates that this file is a client-side component.
"use client";

// Import necessary React hooks and components.
import { useState } from "react";
import { ClubCard } from "@/components/club-card";
import { Input } from "@/components/ui/input";
import { useData } from "@/hooks/use-data";

// The main component for the "All Clubs" page.
export default function AllClubsPage() {
  // Fetches club data and loading state using a custom hook.
  const { clubs, loading } = useData();
  // State for the search term entered by the user.
  const [searchTerm, setSearchTerm] = useState("");

  // Filters the list of clubs based on the search term.
  // It checks if the club's name or description includes the search term.
  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If the data is still loading, it displays a loading message.
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-xl">Loading clubs...</div>
      </div>
    );
  }

  // Renders the main content of the page.
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          All Clubs
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Find your community. Explore all the clubs available on campus.
        </p>
      </header>

      {/* Search input field */}
      <div className="mb-8 max-w-lg mx-auto">
        <Input
          type="text"
          placeholder="Search for a club..."
          className="w-full bg-transparent text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search clubs"
        />
      </div>

      {/* Displays the filtered list of clubs or a "no results" message. */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredClubs.map((club, i) => (
            <ClubCard 
              key={club.id} 
              club={club} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl font-semibold text-muted-foreground">
            No clubs found.
          </p>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
}
