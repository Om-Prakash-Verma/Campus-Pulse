
"use client";

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from './event-card';
import type { Event, Club } from '@/lib/types';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventCalendarProps {
    events: Event[];
    clubsById: Record<string, Club>;
}

export function EventCalendar({ events, clubsById }: EventCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            const date = format(new Date(event.date), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, Event[]>);
    }, [events]);

    const selectedDayEvents = useMemo(() => {
        if (!selectedDate) return [];
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return eventsByDate[dateKey] || [];
    }, [selectedDate, eventsByDate]);

    const eventDays = useMemo(() => {
        return Object.keys(eventsByDate).map(dateStr => new Date(dateStr));
    }, [eventsByDate]);

    return (
        <Card className="glassmorphism grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden">
            <div className="md:col-span-2 p-4 md:border-r border-border">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="p-0"
                    classNames={{
                        day_selected: "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        day_today: "bg-muted text-foreground",
                    }}
                    modifiers={{
                        hasEvent: eventDays,
                    }}
                    modifiersClassNames={{
                        hasEvent: "has-event",
                    }}
                    components={{
                        DayContent: (props) => {
                            const hasEvent = eventsByDate[format(props.date, 'yyyy-MM-dd')];
                            return (
                                <div className="relative">
                                    {props.date.getDate()}
                                    {hasEvent && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"></div>}
                                </div>
                            );
                        },
                        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                        IconRight: () => <ChevronRight className="h-4 w-4" />,
                    }}
                />
            </div>
            <div className="md:col-span-1 p-4 flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h2>
                {selectedDate ? (
                    selectedDayEvents.length > 0 ? (
                        <div className="flex-grow space-y-2 overflow-y-auto max-h-[500px] pr-2">
                            {selectedDayEvents.map(event => (
                                <EventCard key={event.id} event={event} club={clubsById[event.clubId]} variant="compact" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-muted-foreground text-center">
                            <p>No events scheduled for this day.</p>
                        </div>
                    )
                ) : (
                    <div className="flex-grow flex items-center justify-center text-muted-foreground text-center">
                        <p>Select a day to see events.</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
