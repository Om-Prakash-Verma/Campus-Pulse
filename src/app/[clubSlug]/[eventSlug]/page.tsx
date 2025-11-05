
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Star, Upload, Trash2, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/components/event-icons';
import type { Event, Club, Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/hooks/use-data';


const AUTH_SESSION_KEY = "campus-pulse-auth-club";

const reviewSchema = z.object({
    author: z.string().min(2, "Name is required"),
    rating: z.coerce.number().min(1, "Rating is required").max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters")
});
type ReviewSchema = z.infer<typeof reviewSchema>;


export default function EventSlugPage() {
  const { toast } = useToast();
  const { events, clubs, loading, setEvents: setAllEvents } = useData();
  const [loggedInClub, setLoggedInClub] = useState<Club | null>(null);
  const params = useParams();
  const clubSlug = params.clubSlug as string;
  const eventSlug = params.eventSlug as string;

  const reviewForm = useForm<ReviewSchema>({
      resolver: zodResolver(reviewSchema),
      defaultValues: { author: "", rating: 0, comment: "" }
  });

  useEffect(() => {
    const authData = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (authData) setLoggedInClub(JSON.parse(authData));
  }, []);

  const { event, club, isEventInPast, averageRating, isClubAdmin } = useMemo(() => {
    if (loading) return { event: null, club: null, isEventInPast: false, averageRating: 0, isClubAdmin: false };
    
    const associatedClub = clubs.find(c => c.slug === clubSlug);
    if (!associatedClub) return { event: null, club: null, isEventInPast: false, averageRating: 0, isClubAdmin: false };
    
    const currentEvent = events.find(e => e.slug === eventSlug && e.clubId === associatedClub.id);
    if (!currentEvent) return { event: null, club: associatedClub, isEventInPast: false, averageRating: 0, isClubAdmin: false };

    const past = new Date(currentEvent.date) < new Date();
    const totalRating = currentEvent.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0;
    const avg = currentEvent.reviews?.length ? totalRating / currentEvent.reviews.length : 0;
    const admin = loggedInClub?.id === currentEvent.clubId;

    return { event: currentEvent, club: associatedClub, isEventInPast: past, averageRating: avg, isClubAdmin: admin };
  }, [eventSlug, clubSlug, events, clubs, loggedInClub, loading]);


  const handleReviewSubmit: SubmitHandler<ReviewSchema> = (data) => {
    if (!event) return;
    const newReview: Review = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...data,
    };
    const updatedEvent: Event = {
        ...event,
        reviews: [...(event.reviews || []), newReview]
    };
    const updatedEvents = events.map(e => e.id === event.id ? updatedEvent : e);
    
    setAllEvents(updatedEvents);
    toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
    reviewForm.reset();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!event) return;
      const files = e.target.files;
      if (!files) return;

      let processedFiles = 0;
      const newImages: string[] = [];
      
      const fileReadHandler = () => {
          processedFiles++;
          if (processedFiles === files.length) {
              const updatedEvent = { ...event, gallery: [...(event.gallery || []), ...newImages] };
              const updatedEvents = events.map(e => e.id === event.id ? updatedEvent : e);
              setAllEvents(updatedEvents);
              toast({ title: "Images Uploaded", description: `${files.length} image(s) added to the gallery.` });
          }
      };

      Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
              newImages.push(reader.result as string);
              fileReadHandler();
          };
          reader.readAsDataURL(file);
      });
  };
  
  const handleDeleteImage = (imgUrl: string) => {
      if (!event) return;
      const updatedGallery = event.gallery?.filter(img => img !== imgUrl);
      const updatedEvent = { ...event, gallery: updatedGallery };
      const updatedEvents = events.map(e => e.id === event.id ? updatedEvent : e);
      setAllEvents(updatedEvents);
      toast({ title: "Image Deleted" });
  };


  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-xl">Loading event...</div>
      </div>
    );
  }

  if (!event || !club) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Event Not Found</h1>
          <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the event you're looking for.</p>
        </div>
      </div>
    );
  }
  
  const eventDateObj = new Date(event.date);


  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="glassmorphism overflow-hidden">
        <div className="relative h-64 w-full md:h-96">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="event banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <CardContent className="p-6 md:p-8">
          <div className="relative -mt-20">
            <div className="mb-6 flex items-end gap-4">
               <div className="flex size-20 items-center justify-center rounded-lg border border-white/20 bg-card/50 backdrop-blur-md">
                 <Avatar className="h-16 w-16">
                    {club.logo ? (
                      <AvatarImage src={club.logo} alt={club.name} />
                    ) : (
                      <AvatarFallback>
                          <CategoryIcon category={club.category} className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
               </div>
               <div>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href={`/${club.slug}`} className="font-semibold text-accent text-base">
                      {club.name}
                    </Link>
                  </Button>
                  <h1 className="text-3xl font-bold text-white md:text-4xl">{event.title}</h1>
               </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-lg bg-black/20 p-4">
                <Calendar className="mt-1 h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-semibold">Date & Time</h3>
                  <p className="text-muted-foreground">{format(eventDateObj, 'EEEE, MMMM d, yyyy')}</p>
                   <p className="text-muted-foreground">{format(eventDateObj, 'p')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-black/20 p-4">
                <MapPin className="mt-1 h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-foreground/90">
                <h2 className="text-2xl font-semibold text-white">About this event</h2>
                <p>{event.description}</p>
            </div>
            
            {event.tags && event.tags.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                </div>
            )}

            <div className="mt-8 border-t border-white/10 pt-8 flex gap-4">
                {!isEventInPast && (
                    <Button asChild size="lg" className="bg-accent text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_0_15px_2px_hsl(var(--accent)/0.7)]">
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                            <Ticket className="mr-2"/>
                            Register Now
                        </a>
                    </Button>
                )}
            </div>

          </div>
        </CardContent>
      </Card>
      
      {isEventInPast && (
        <div className="space-y-8 mt-8">
            <Card className="glassmorphism">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Photo Gallery</CardTitle>
                        {isClubAdmin && (
                            <Button asChild size="sm" variant="outline">
                                <label htmlFor="gallery-upload" className="cursor-pointer flex items-center">
                                    <Upload className="mr-2 h-4 w-4" /> Add Photos
                                    <input id="gallery-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} />
                                </label>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {event.gallery && event.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {event.gallery.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square">
                                    <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="rounded-lg object-cover" />
                                    {isClubAdmin && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Button variant="destructive" size="icon" onClick={() => handleDeleteImage(img)}><Trash2 /></Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-muted-foreground">No photos have been uploaded for this event yet.</p>}
                </CardContent>
            </Card>

            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                    {averageRating > 0 && (
                        <div className="flex items-center gap-2 text-lg">
                            <span className="font-bold text-accent">{averageRating.toFixed(1)}</span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />)}
                            </div>
                            <span className="text-sm text-muted-foreground">({event.reviews?.length || 0} reviews)</span>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {event.reviews && event.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {event.reviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(review => (
                                <div key={review.id} className="flex gap-4 items-start">
                                    <Avatar>
                                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold">{review.author}</p>
                                            <span className="text-xs text-muted-foreground">{format(new Date(review.date), 'PP')}</span>
                                        </div>
                                         <div className="flex">
                                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />)}
                                        </div>
                                        <p className="text-muted-foreground mt-2">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews have been submitted for this event yet.</p>
                    )}
                </CardContent>
            </Card>
            
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>Leave a Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...reviewForm}>
                        <form onSubmit={reviewForm.handleSubmit(handleReviewSubmit)} className="space-y-4">
                                <FormField control={reviewForm.control} name="author" render={({ field }) => (
                                <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={reviewForm.control} name="rating" render={({ field }) => (
                                <FormItem><FormLabel>Rating</FormLabel><FormControl>
                                    <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star}
                                            className={`cursor-pointer h-8 w-8 transition-colors ${field.value >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                                            onClick={() => field.onChange(star)}
                                        />
                                    ))}
                                    </div>
                                </FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={reviewForm.control} name="comment" render={({ field }) => (
                                <FormItem><FormLabel>Your Comment</FormLabel><FormControl><Textarea {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <Button type="submit">Submit Review</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      )}

    </div>
  );
}

    
