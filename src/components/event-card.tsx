// Import necessary components and libraries
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Event, Club } from '@/lib/types';
import { CategoryIcon } from './event-icons';

// Define the props for the EventCard component
interface EventCardProps {
  event: Event; // The event object to display
  club?: Club; // The club associated with the event (optional)
  variant?: 'default' | 'compact'; // The card variant to display
}

// The EventCard component displays a single event.
export function EventCard({ event, club, variant = 'default' }: EventCardProps) {
  // Handles the click event for the register button.
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Opens the event registration link in a new tab.
    window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
  };

  // Get the category from the club object.
  const category = club?.category;
  // Construct the link to the event page.
  const href = club ? `/${club.slug}/${event.slug}` : '#';

  // If there is no club, don't render the card.
  if (!club) {
    // Optional: Render a placeholder or nothing if club data is not available
    return null; 
  }

  // Render the compact variant of the card.
  if (variant === 'compact') {
    return (
      <Link href={href} className="flex">
        <Card className="glassmorphism group flex w-full flex-row items-center overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/20">
          {/* Event image */}
          <div className="relative h-full w-20 flex-shrink-0">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint="event image"
            />
          </div>
          <div className="flex-grow p-3">
            {/* Event title */}
            <CardTitle className="mb-1 line-clamp-1 text-base font-bold">{event.title}</CardTitle>
            {/* Event date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(event.date), 'p')}</span>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Render the default variant of the card.
  return (
    <Link href={href} className="flex">
      <Card className="glassmorphism group flex w-full flex-col overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 hover:scale-[0.98]">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            {/* Event image */}
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="event image"
            />
            {/* Gradient overlay for the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
              {/* Display the event category */}
              {category && (
                 <div className="flex items-center gap-2">
                  <CategoryIcon category={category} className="h-6 w-6 text-accent drop-shadow-[0_0_5px_hsl(var(--accent))]" />
                  <span className="font-semibold text-white">{category}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          {/* Event title */}
          <CardTitle className="mb-2 line-clamp-2 text-xl font-bold">{event.title}</CardTitle>
          <div className="mb-4 flex flex-col gap-2 text-sm text-muted-foreground">
            {/* Event date and time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.date), 'PPp')}</span>
            </div>
            {/* Event location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          {/* Event description */}
          <CardDescription className="line-clamp-3">{event.description}</CardDescription>
        </CardContent>
        <CardFooter>
          {/* Register button */}
          <Button 
            className="w-full bg-accent text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_0_15px_2px_hsl(var(--accent)/0.7)]"
            onClick={handleRegisterClick}
          >
            Register Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
