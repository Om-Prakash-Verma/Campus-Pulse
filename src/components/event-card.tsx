
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

interface EventCardProps {
  event: Event;
  club?: Club;
  variant?: 'default' | 'compact';
}

export function EventCard({ event, club, variant = 'default' }: EventCardProps) {
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
  };

  const category = club?.category;
  const href = club ? `/${club.slug}/${event.slug}` : '#';

  if (!club) {
    // Optional: Render a placeholder or nothing if club data is not available
    return null; 
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="flex">
        <Card className="glassmorphism group flex w-full flex-row items-center overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/20">
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
            <CardTitle className="mb-1 line-clamp-1 text-base font-bold">{event.title}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(event.date), 'p')}</span>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={href} className="flex">
      <Card className="glassmorphism group flex w-full flex-col overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 hover:scale-[0.98]">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="event image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
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
          <CardTitle className="mb-2 line-clamp-2 text-xl font-bold">{event.title}</CardTitle>
          <div className="mb-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.date), 'PPp')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <CardDescription className="line-clamp-3">{event.description}</CardDescription>
        </CardContent>
        <CardFooter>
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
