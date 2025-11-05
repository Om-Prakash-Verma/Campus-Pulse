
"use client";

import { useState } from "react";
import { ClubCard } from "@/components/club-card";
import { Input } from "@/components/ui/input";
import { useData } from "@/hooks/use-data";

export default function AllClubsPage() {
  const { clubs, loading } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-xl">Loading clubs...</div>
      </div>
    );
  }

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
