"use client";

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event, Club } from "@/lib/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import EventForm from "./EventForm";
import { useToast } from "@/hooks/use-toast";
import { slugify } from '@/lib/utils';

// Schema for event form validation
export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  location: z.string().min(3, "Location is required"),
  registrationLink: z.string().url("Must be a valid URL"),
  image: z.string().optional(),
  tags: z.string().optional(),
});
// Type for event form data
export type EventSchema = z.infer<typeof eventSchema>;


// Props for the EventTabs component
interface EventTabsProps {
    club: Club;
    allEvents: Event[];
    setAllEvents: (events: Event[]) => void;
}

// A reusable table component for displaying a list of events
const EventTable = ({ events, title, onEdit, onDelete }: { events: Event[], title: string, onEdit: (event: Event) => void, onDelete: (id: string) => void }) => (
    <Card className="glassmorphism">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{format(new Date(event.date), 'PP')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No events found in this category.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
);

// Main component for managing and displaying club events
export default function EventTabs({ club, allEvents, setAllEvents }: EventTabsProps) {
    const { toast } = useToast();
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

    // Initialize the form with react-hook-form and zod for validation
    const eventForm = useForm<EventSchema>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
        title: '', description: '', date: undefined, time: '18:00',
        location: '', registrationLink: '', image: '', tags: ''
      }
    });

    // Opens the event form, pre-filling with data if an event is being edited
    const handleOpenEventForm = (event: Event | null) => {
        setEditingEvent(event);
        if (event) {
            const eventDate = new Date(event.date);
            eventForm.reset({ 
                ...event, 
                date: eventDate,
                time: format(eventDate, 'HH:mm'),
                tags: event.tags?.join(', ') || ''
            });
        } else {
            eventForm.reset({
                title: '', description: '', date: undefined, time: '18:00',
                location: '', registrationLink: '', image: '', tags: ''
            });
        }
        setIsEventFormOpen(true);
    };

    // Handles the submission of the event form
    const handleEventFormSubmit: SubmitHandler<EventSchema> = (data) => {
        const [hours, minutes] = data.time.split(':').map(Number);
        const combinedDate = new Date(data.date);
        combinedDate.setHours(hours, minutes);

        const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

        const eventData = {
            ...data,
            date: combinedDate.toISOString(),
            clubId: club.id,
            slug: slugify(data.title),
            image: data.image || `https://picsum.photos/seed/${slugify(data.title)}/600/400`,
            tags: tagsArray
        };
        
        const { time, ...finalEventData } = eventData;

        if (editingEvent) {
            // Updates an existing event
            setAllEvents(
                allEvents.map((e) => (e.id === editingEvent.id ? { ...e, ...finalEventData } : e))
            );
            toast({ title: "Event Updated", description: `"${data.title}" has been updated.` });
        } else {
            // Creates a new event
            const newEvent: Event = { 
                id: Date.now().toString(), 
                ...finalEventData, 
                category: club.category,
                reviews: [],
                gallery: []
            };
            setAllEvents([newEvent, ...allEvents]);
            toast({ title: "Event Created", description: `"${data.title}" has been added.` });
        }
        setIsEventFormOpen(false);
    };

    // Deletes an event after confirmation
    const handleDeleteEvent = () => {
        if (deletingEventId) {
            const updatedEvents = allEvents.filter(e => e.id !== deletingEventId)
            setAllEvents(updatedEvents);
            toast({ title: "Event Deleted" });
            setDeletingEventId(null);
        }
    }

    // Memoized separation of events into upcoming and past categories
    const { upcomingEvents, pastEvents } = useMemo(() => {
        const now = new Date();
        const clubEvents = allEvents.filter(event => event.clubId === club.id);

        const upcoming = clubEvents
            .filter(event => new Date(event.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const past = clubEvents
            .filter(event => new Date(event.date) < now)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { upcomingEvents: upcoming, pastEvents: past };
    }, [allEvents, club.id]);
    
    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={() => handleOpenEventForm(null)}><PlusCircle className="mr-2 h-4 w-4"/>Create Event</Button>
            </div>
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <EventTable events={upcomingEvents} title="Upcoming Events" onEdit={handleOpenEventForm} onDelete={setDeletingEventId} />
                </TabsContent>
                <TabsContent value="past">
                    <EventTable events={pastEvents} title="Past Events" onEdit={handleOpenEventForm} onDelete={setDeletingEventId} />
                </TabsContent>
            </Tabs>

            {/* Form for creating/editing events */}
            <EventForm
                isOpen={isEventFormOpen}
                setIsOpen={setIsEventFormOpen}
                editingEvent={editingEvent}
                form={eventForm}
                onSubmit={handleEventFormSubmit}
            />

            {/* Confirmation dialog for deleting an event */}
            <AlertDialog open={!!deletingEventId} onOpenChange={() => setDeletingEventId(null)}>
                <AlertDialogContent className="glassmorphism">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the event.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
