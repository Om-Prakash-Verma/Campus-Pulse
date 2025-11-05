
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useData } from '@/hooks/use-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/components/event-icons';
import type { Event, Club, Person } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventCard } from '@/components/event-card';
import { Mail, Phone, Link as LinkIcon, Rss } from 'lucide-react';
import Link from 'next/link';

export default function ClubPage() {
  const { clubs, events, loading } = useData();
  const params = useParams();
  const clubSlug = params.clubSlug as string;

  const { club, clubEvents } = useMemo(() => {
    if (loading) return { club: null, clubEvents: [] };
    
    const foundClub = clubs.find((c: Club) => c.slug === clubSlug);
    if (!foundClub) return { club: null, clubEvents: [] };

    const foundEvents = events.filter(e => e.clubId === foundClub.id);
    return { club: foundClub, clubEvents: foundEvents };
  }, [clubSlug, clubs, events, loading]);
  
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = clubEvents
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = clubEvents
      .filter(event => new Date(event.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [clubEvents]);

  const clubThemeStyle = useMemo(() => {
    if (!club?.themeColor) return {};
    return { '--theme-accent': club.themeColor } as React.CSSProperties;
  }, [club?.themeColor]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-xl">Loading club page...</div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Club Not Found</h1>
          <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the club you're looking for.</p>
        </div>
      </div>
    );
  }

  const EventList = ({ title, events }: { title: string; events: Event[] }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <EventCard 
              key={event.id} 
              event={event} 
              club={club} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 rounded-lg glassmorphism">
          <p className="text-xl text-muted-foreground">No {title.toLowerCase()} found.</p>
        </div>
      )}
    </div>
  );

  const TeamList = ({ title, people }: { title: string; people: Person[] }) => (
    <div className='mb-8'>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        {people && people.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map(person => (
                    <Card key={person.id} className="glassmorphism text-center">
                        <CardContent className="p-6">
                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                <AvatarImage src={person.avatar} alt={person.name} />
                                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h4 className="text-lg font-semibold">{person.name}</h4>
                            <p className="text-[var(--theme-accent,hsl(var(--accent)))]">{person.branch || person.department}</p>
                            <div className="mt-4 flex justify-center items-center gap-4">
                                {person.email && <a href={`mailto:${person.email}`} className="text-muted-foreground hover:text-[var(--theme-accent,hsl(var(--accent)))]"><Mail /></a>}
                                {person.phone && <a href={`tel:${person.phone}`} className="text-muted-foreground hover:text-[var(--theme-accent,hsl(var(--accent)))]"><Phone /></a>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
          <p className='text-muted-foreground'>No one here yet.</p>
        )}
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12" style={clubThemeStyle}>
      <Card className="glassmorphism overflow-hidden mb-12">
        <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
               <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-[var(--theme-accent,hsl(var(--accent)))]">
                {club.logo ? (
                  <AvatarImage src={club.logo} alt={club.name} />
                ) : (
                  <AvatarFallback>
                      <CategoryIcon category={club.category} className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
               <div className="text-center md:text-left">
                  <span className="font-semibold text-[var(--theme-accent,hsl(var(--accent)))]">{club.category}</span>
                  <h1 className="text-4xl font-bold text-white md:text-5xl">{club.name}</h1>
                  <p className="text-lg text-muted-foreground mt-2 max-w-2xl">{club.description}</p>
               </div>
            </div>
        </CardContent>
      </Card>
      
      <EventList title="Upcoming Events" events={upcomingEvents} />

      {club.resources && club.resources.length > 0 && (
          <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Resources</h2>
              <Card className="glassmorphism">
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {club.resources.map(resource => (
                          <Button key={resource.id} variant="outline" asChild className="justify-start">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  <LinkIcon className="mr-2"/> {resource.label}
                              </a>
                          </Button>
                      ))}
                  </CardContent>
              </Card>
          </div>
      )}
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Team</h2>
        <Card className="glassmorphism">
          <CardContent className="p-8">
            <TeamList title="Leaders" people={club.leaders || []} />
            <TeamList title="Members" people={club.members || []} />
          </CardContent>
        </Card>
      </div>

      <EventList title="Past Events" events={pastEvents} />
    </div>
  );
}
