
// Specifies that this component should only be rendered on the client-side
"use client";

// Import necessary hooks from React for state management and memoization
import { useState, useMemo, useEffect } from "react";
// Import date formatting function from date-fns library
import { format } from "date-fns";
// Import UI components from the project's component library
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
// Import custom data types for events, clubs, and event categories
import { type EventCategory, type Event, type Club } from "@/lib/types";
// Import icons for different event categories
import { CATEGORY_ICONS } from "@/components/event-icons";
// Import the ClubCard component for displaying club information
import { ClubCard } from "@/components/club-card";
// Import the Link component from Next.js for client-side navigation
import Link from "next/link";
// Import the Skeleton component for loading state UI
import { Skeleton } from "@/components/ui/skeleton";
// Import icons from the lucide-react library
import { Calendar as CalendarIcon, List, Calendar as CalendarViewIcon } from "lucide-react";
// Import Popover components for creating dropdowns and pop-up elements
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// Import the Calendar component for date picking
import { Calendar } from "@/components/ui/calendar";
// Import a utility function for combining CSS classes
import { cn } from "@/lib/utils";
// Import the EventCalendar component for displaying events in a calendar view
import { EventCalendar } from "@/components/event-calendar";
// Import the useData hook for fetching event and club data
import { useData } from "@/hooks/use-data";


// An array of available event categories, including "All"
const categories: ("All" | EventCategory)[] = ["All", "Academic", "Social", "Sports", "Music", "Tech"];

// The main component for the home page
export default function Home() {
  // Fetches event and club data, and the loading state using the useData hook
  const { events, clubs, loading } = useData();
  // State for the search term entered by the user
  const [searchTerm, setSearchTerm] = useState("");
  // State for the currently selected event category
  const [activeCategory, setActiveCategory] = useState<"All" | EventCategory>("All");
  // State to toggle between list and calendar view
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  // State for the selected date range for filtering events
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });

  // Memoized mapping of club IDs to club objects for efficient lookup
  const clubsById = useMemo(() => {
    return clubs.reduce((acc, club) => {
      acc[club.id] = club;
      return acc;
    }, {} as Record<string, Club>);
  }, [clubs]);


  // Memoized and filtered list of events based on the search term, active category, and date range
  const filteredEvents = useMemo(() => {
    return events
      // Filters events based on the selected date range
      .filter((event) => {
        const eventDate = new Date(event.date);
        const fromDate = dateRange.from;
        const toDate = dateRange.to;

        // If a "from" date is selected, filter out events before that date
        if (fromDate && eventDate < fromDate) return false;
        // If a "to" date is selected, filter out events after that date (end of day)
        if (toDate) {
            const toDateEndofDay = new Date(toDate);
            toDateEndofDay.setHours(23, 59, 59, 999);
            if(eventDate > toDateEndofDay) return false;
        }
        return true;
      })
      // Filters events based on the active category
      .filter((event) => {
        const eventCategory = clubsById[event.clubId]?.category;
        // If "All" is selected, show all events
        if (activeCategory === "All") return true;
        // Otherwise, only show events from the selected category
        return eventCategory === activeCategory;
      })
      // Filters events based on the search term (title, description, or tags)
      .filter((event) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        // Checks if any of the event's tags match the search term
        const hasMatchingTag = event.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm));

        // Returns true if the search term is found in the title, description, or tags
        return event.title.toLowerCase().includes(lowerSearchTerm) ||
        event.description.toLowerCase().includes(lowerSearchTerm) ||
        (hasMatchingTag ?? false)
      }
      )
      // Sorts the filtered events by date in ascending order
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [searchTerm, activeCategory, events, clubsById, dateRange]);

  // Memoized list of the first four clubs to be showcased on the home page
  const showcasedClubs = useMemo(() => clubs.slice(0, 4), [clubs]);

  // A function that renders skeleton loaders for the event cards while data is being fetched
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

  // The main render method for the Home component
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section with the main title and a brief description */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Campus Pulse
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Discover, engage, and experience. Your ultimate guide to college happenings.
        </p>
      </header>

      {/* Search and filter controls section */}
      <div className="mb-8 p-4 rounded-lg glassmorphism sticky top-[4.5rem] z-10 space-y-4">
        {/* Search input and date range pickers */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search input field */}
          <Input
            type="text"
            placeholder="Search by title, description or tag..."
            className="w-full md:flex-1 bg-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
          />
          {/* Date range filter section */}
          <div className="flex items-center gap-2">
            {/* Popover for selecting the "from" date */}
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
            {/* Popover for selecting the "to" date */}
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
            {/* Button to clear the selected date range */}
            <Button variant="ghost" onClick={() => setDateRange({from: undefined, to: undefined})}>Clear</Button>
          </div>
        </div>
        {/* Category filters and view mode toggles */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
            {/* Buttons for filtering events by category */}
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
            {/* Buttons for switching between list and calendar view */}
            <div className="flex items-center gap-2">
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="mr-2" />List</Button>
                <Button variant={viewMode === 'calendar' ? 'default' : 'ghost'} onClick={() => setViewMode('calendar')}><CalendarViewIcon className="mr-2" />Calendar</Button>
            </div>
        </div>
      </div>

      {/* Conditional rendering of events list or calendar view */}
      {loading ? (
        // Renders skeleton loaders while data is loading
        renderSkeletons()
      ) : viewMode === 'list' ? (
        // Renders the list of events if there are any
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
            // Renders a message if no events are found
            <div className="text-center py-16">
            <p className="text-2xl font-semibold text-muted-foreground">No events found.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
        )
      ) : (
        // Renders the calendar view of events
        <EventCalendar events={filteredEvents} clubsById={clubsById} />
      )}


      {/* Section for showcasing featured clubs */}
      <div className="mt-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explore Our Clubs
        </h2>
        {/* Grid of showcased club cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {showcasedClubs.map((club, i) => (
            <ClubCard
                key={club.id}
                club={club}
            />
          ))}
        </div>
        {/* Button to navigate to the full list of clubs */}
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/clubs">View All Clubs</Link>
            </Button>
        </div>
      </div>

    </div>
  );
}
