// Indicate that this component should only be rendered on the client side
"use client";

// Import necessary hooks from React
import { useState, useMemo } from 'react';
// Import date formatting function from date-fns
import { format } from 'date-fns';
// Import UI components
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { EventCard } from './event-card';
// Import custom types
import type { Event, Club } from '@/lib/types';
// Import icons from lucide-react
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the props interface for the EventCalendar component
interface EventCalendarProps {
    events: Event[]; // An array of event objects
    clubsById: Record<string, Club>; // A record of club objects indexed by their ID
}

/**
 * Renders an interactive event calendar.
 * Displays a calendar and a list of events for the selected day.
 * @param {EventCalendarProps} props - The props for the component.
 * @returns {JSX.Element} The rendered event calendar component.
 */
export function EventCalendar({ events, clubsById }: EventCalendarProps) {
    // State to keep track of the currently selected date on the calendar
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    // State to keep track of the month currently displayed on the calendar
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Memoize the events grouped by date for efficient access
    const eventsByDate = useMemo(() => {
        // Group events by date string (e.g., "2023-10-27")
        return events.reduce((acc, event) => {
            const date = format(new Date(event.date), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, Event[]>);
    }, [events]); // Recalculate only when the events array changes

    // Memoize the list of events for the currently selected date
    const selectedDayEvents = useMemo(() => {
        if (!selectedDate) return [];
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return eventsByDate[dateKey] || [];
    }, [selectedDate, eventsByDate]); // Recalculate when selectedDate or eventsByDate change

    // Memoize the array of dates that have events
    const eventDays = useMemo(() => {
        return Object.keys(eventsByDate).map(dateStr => new Date(dateStr));
    }, [eventsByDate]); // Recalculate only when eventsByDate changes

    return (
        // Main container card with glassmorphism effect
        <Card className="glassmorphism grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden">
            {/* Left section: Calendar view */}
            <div className="md:col-span-2 p-4 md:border-r border-border">
                <Calendar
                    mode="single" // Allow only a single date to be selected
                    selected={selectedDate} // The currently selected date
                    onSelect={setSelectedDate} // Function to update the selected date
                    month={currentMonth} // The month to display
                    onMonthChange={setCurrentMonth} // Function to update the displayed month
                    className="p-0"
                    // Custom class names for styling calendar elements
                    classNames={{
                        day_selected: "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        day_today: "bg-muted text-foreground",
                    }}
                    // Modifiers to apply custom styles or content to specific days
                    modifiers={{
                        hasEvent: eventDays, // Apply 'hasEvent' modifier to days with events
                    }}
                    modifiersClassNames={{
                        hasEvent: "has-event", // CSS class for days with events
                    }}
                    // Custom components to override default calendar parts
                    components={{
                        // Custom renderer for the day cell content
                        DayContent: (props) => {
                            const hasEvent = eventsByDate[format(props.date, 'yyyy-MM-dd')];
                            return (
                                <div className="relative">
                                    {props.date.getDate()}
                                    {/* Add a dot indicator if the day has events */}
                                    {hasEvent && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"></div>}
                                </div>
                            );
                        },
                        // Custom icons for month navigation
                        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                        IconRight: () => <ChevronRight className="h-4 w-4" />,
                    }}
                />
            </div>
            {/* Right section: Event list for the selected day */}
            <div className="md:col-span-1 p-4 flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {/* Display the selected date or a prompt */}
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h2>
                {selectedDate ? (
                    selectedDayEvents.length > 0 ? (
                        // If there are events, display them in a scrollable list
                        <div className="flex-grow space-y-2 overflow-y-auto max-h-[500px] pr-2">
                            {selectedDayEvents.map(event => (
                                <EventCard key={event.id} event={event} club={clubsById[event.clubId]} variant="compact" />
                            ))}
                        </div>
                    ) : (
                        // If there are no events, show a message
                        <div className="flex-grow flex items-center justify-center text-muted-foreground text-center">
                            <p>No events scheduled for this day.</p>
                        </div>
                    )
                ) : (
                    // If no date is selected, show a prompt
                    <div className="flex-grow flex items-center justify-center text-muted-foreground text-center">
                        <p>Select a day to see events.</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
