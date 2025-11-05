
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/event-icons";
import { LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventTabs from "./EventTabs";
import ProfileTabs from "./ProfileTabs";
import ExpensesTab from "./ExpensesTab";
import { useData } from "@/hooks/use-data";

import type { Club, Event } from "@/lib/types";

interface DashboardProps {
    club: Club;
    onLogout: () => void;
    setLoggedInClub: (club: Club | null) => void;
}

export default function Dashboard({
    club,
    onLogout,
    setLoggedInClub,
}: DashboardProps) {
    const { events: allEvents, clubs, setClubs, setEvents: setAllEvents } = useData();
    const clubEvents = allEvents.filter(event => event.clubId === club.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    {club.logo ? (
                    <AvatarImage src={club.logo} alt={club.name} />
                    ) : (
                    <AvatarFallback>
                        <CategoryIcon category={club.category} className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                    )}
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">Club Dashboard</h1>
                    <p className="text-muted-foreground">Managing <span className="font-semibold text-accent">{club.name}</span></p>
                </div>
                </div>
                <div className="flex items-center gap-4">
                <Button asChild>
                    <a href={`/${club.slug}`} target="_blank" rel="noopener noreferrer">View Public Page</a>
                </Button>
                <Button variant="ghost" onClick={onLogout}><LogOut className="mr-2" /> Logout</Button>
                </div>
            </div>

            <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="profile">Profile & Team</TabsTrigger>
                    <TabsTrigger value="expenses">Finance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events">
                    <EventTabs 
                        club={club}
                        allEvents={allEvents}
                        setAllEvents={setAllEvents}
                    />
                </TabsContent>

                <TabsContent value="profile" className="space-y-8">
                    <ProfileTabs
                        club={club}
                        clubs={clubs}
                        setClubs={setClubs}
                        setLoggedInClub={setLoggedInClub}
                    />
                </TabsContent>
                
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
