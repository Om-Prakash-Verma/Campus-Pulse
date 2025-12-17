
// Indicates that this is a client-side component, necessary for using hooks like `useState` and `useEffect`, and for handling user interactions.
"use client";

// Import UI components from the project's design system.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/event-icons"; // Custom icon component for event categories.
import { LogOut } from "lucide-react"; // Icon for the logout button.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Components for creating a tabbed interface.

// Import custom components for each tab in the dashboard.
import EventTabs from "./EventTabs";
import ProfileTabs from "./ProfileTabs";
import ExpensesTab from "./ExpensesTab";

// Import the custom hook for accessing and manipulating application data.
import { useData } from "@/hooks/use-data";

// Import TypeScript types for data structures used in the component.
import type { Club, Event } from "@/lib/types";

/**
 * Defines the properties required by the Dashboard component.
 */
interface DashboardProps {
    /** The club object for the currently logged-in user. */
    club: Club;
    /** A callback function to handle the user logging out. */
    onLogout: () => void;
    /** A function to update the state of the logged-in club. */
    setLoggedInClub: (club: Club | null) => void;
}

/**
 * The main component for the club administration dashboard.
 * It provides a tabbed interface for managing events, club profile, team members, and finances.
 * @param {DashboardProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered dashboard user interface.
 */
export default function Dashboard({
    club,
    onLogout,
    setLoggedInClub,
}: DashboardProps) {
    // Use the custom `useData` hook to get access to the global application state and functions to update it.
    const { events: allEvents, clubs, setClubs, setEvents: setAllEvents } = useData();
    
    // Filter the list of all events to get only the events associated with the current club.
    const clubEvents = allEvents.filter(event => event.clubId === club.id);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header section of the dashboard */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    {/* Club Avatar */}
                    <Avatar className="h-16 w-16">
                        {club.logo ? (
                            <AvatarImage src={club.logo} alt={club.name} />
                        ) : (
                            <AvatarFallback>
                                {/* Display a category icon as a fallback if no logo is available */}
                                <CategoryIcon category={club.category} className="h-8 w-8 text-muted-foreground" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">Club Dashboard</h1>
                        <p className="text-muted-foreground">Managing <span className="font-semibold text-accent">{club.name}</span></p>
                    </div>
                </div>
                {/* Action buttons in the header */}
                <div className="flex items-center gap-4">
                    {/* Link to view the public-facing page for the club. */}
                    <Button asChild>
                        <a href={`/${club.slug}`} target="_blank" rel="noopener noreferrer">View Public Page</a>
                    </Button>
                    {/* Logout button */}
                    <Button variant="ghost" onClick={onLogout}><LogOut className="mr-2" /> Logout</Button>
                </div>
            </div>

            {/* Tabbed interface for different management sections. */}
            <Tabs defaultValue="events" className="w-full">
                {/* List of triggers to switch between tabs. */}
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="profile">Profile & Team</TabsTrigger>
                    <TabsTrigger value="expenses">Finance</TabsTrigger>
                </TabsList>
                
                {/* Content for the "Events" tab. */}
                <TabsContent value="events">
                    <EventTabs 
                        club={club}
                        allEvents={allEvents}
                        setAllEvents={setAllEvents}
                    />
                </TabsContent>

                {/* Content for the "Profile & Team" tab. */}
                <TabsContent value="profile" className="space-y-8">
                    <ProfileTabs
                        club={club}
                        clubs={clubs}
                        setClubs={setClubs}
                        setLoggedInClub={setLoggedInClub}
                    />
                </TabsContent>
                
                {/* Content for the "Finance" tab. */}
                <TabsContent value="expenses">
                    <ExpensesTab
                        club={club}
                        clubEvents={clubEvents}
                        clubs={clubs}
                        setClubs={setClubs}
                        setLoggedInClub={setLoggedInClub}
                    />
                </TabsContent>

            </Tabs>
        </div>
    )
}
