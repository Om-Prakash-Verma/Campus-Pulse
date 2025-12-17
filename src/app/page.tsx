
"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { type EventCategory, type Event, type Club } from "@/lib/types";
import { CATEGORY_ICONS } from "@/components/event-icons";
import { ClubCard } from "@/components/club-card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, List, Calendar as CalendarViewIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { EventCalendar } from "@/components/event-calendar";
import { useData } from "@/hooks/use-data";


const categories: ("All" | EventCategory)[] = ["All", "Academic", "Social", "Sports", "Music", "Tech"];

export default function Home() {
  const { events, clubs, loading } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | EventCategory>("All");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });

  const clubsById = useMemo(() => {
    return clubs.reduce((acc, club) => {
      acc[club.id] = club;
      return acc;
    }, {} as Record<string, Club>);
  }, [clubs]);


  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        const fromDate = dateRange.from;
        const toDate = dateRange.to;

        if (fromDate && eventDate < fromDate) return false;
        if (toDate) {
            const toDateEndofDay = new Date(toDate);
            toDateEndofDay.setHours(23, 59, 59, 999);
            if(eventDate > toDateEndofDay) return false;
        }
        return true;
      })
      .filter((event) => {
        const eventCategory = clubsById[event.clubId]?.category;
        if (activeCategory === "All") return true;
        return eventCategory === activeCategory;
      })
      .filter((event) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const hasMatchingTag = event.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm));

        return event.title.toLowerCase().includes(lowerSearchTerm) ||
        event.description.toLowerCase().includes(lowerSearchTerm) ||
        (hasMatchingTag ?? false)
      }
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [searchTerm, activeCategory, events, clubsById, dateRange]);

  const showcasedClubs = useMemo(() => clubs.slice(0, 4), [clubs]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Campus Pulse
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Discover, engage, and experience. Your ultimate guide to college happenings.
        </p>
      </header>

      <div className="mb-8 p-4 rounded-lg glassmorphism sticky top-[4.5rem] z-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Search by title, description or tag..."
            className="w-full md:flex-1 bg-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
          />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[140px] justify-start text-left font-normal bg-transparent",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "LLL d, y") : <span>From Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glassmorphism">
                <Calendar mode="single" selected={dateRange.from} onSelect={(date) => setDateRange(prev => ({...prev, from: date}))} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[140px] justify-start text-left font-normal bg-transparent",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "LLL d, y") : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glassmorphism">
                <Calendar mode="single" selected={dateRange.to} onSelect={(date) => setDateRange(prev => ({...prev, to: date}))} initialFocus />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={() => setDateRange({from: undefined, to: undefined})}>Clear</Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => {
                const Icon = category !== 'All' ? CATEGORY_ICONS[category] : null;
                return (
                    <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "ghost"}
                    onClick={() => setActiveCategory(category)}
                    className={`transition-all duration-300 ${activeCategory === category ? 'bg-accent text-accent-foreground' : ''}`}
                    >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {category}
                    </Button>
                );
                })}
            </div>
            <div className="flex items-center gap-2">
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="mr-2" />List</Button>
                <Button variant={viewMode === 'calendar' ? 'default' : 'ghost'} onClick={() => setViewMode('calendar')}><CalendarViewIcon className="mr-2" />Calendar</Button>
            </div>
        </div>
      </div>

      {loading ? (
        renderSkeletons()
      ) : viewMode === 'list' ? (
        filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, i) => {
                const club = clubsById[event.clubId];
                return (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        club={club} 
                    />
                )
            })}
            </div>
        ) : (
            <div className="text-center py-16">
            <p className="text-2xl font-semibold text-muted-foreground">No events found.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
        )
      ) : (
        <EventCalendar events={filteredEvents} clubsById={clubsById} />
      )}


      <div className="mt-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explore Our Clubs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {showcasedClubs.map((club, i) => (
            <ClubCard 
                key={club.id} 
                club={club} 
            />
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/clubs">View All Clubs</Link>
            </Button>
        </div>
      </div>

    </div>
  );
}
