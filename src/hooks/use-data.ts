
"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialClubs, initialEvents } from '@/lib/events';
import type { Club, Event } from '@/lib/types';

const EVENTS_STORAGE_KEY = "campus-pulse-events";
const CLUBS_STORAGE_KEY = "campus-pulse-clubs";
const STORAGE_CHANGE_EVENT = "storageChange";

// Custom hook to manage application data
export function useData() {
  const [clubs, setClubsState] = useState<Club[]>([]);
  const [events, setEventsState] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to dispatch a custom event when storage changes
  const dispatchStorageChange = () => {
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  };

  const setClubs = useCallback((newClubs: Club[]) => {
    setClubsState(newClubs);
    localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(newClubs));
    dispatchStorageChange();
  }, []);

  const setEvents = useCallback((newEvents: Event[]) => {
    setEventsState(newEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
    dispatchStorageChange();
  }, []);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      const storedClubs = localStorage.getItem(CLUBS_STORAGE_KEY);
      if (storedClubs) {
        setClubsState(JSON.parse(storedClubs));
      } else {
        setClubsState(initialClubs);
        localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(initialClubs));
      }

      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        setEventsState(JSON.parse(storedEvents));
      } else {
        setEventsState(initialEvents);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
      }
      setLoading(false);
    };

    loadData();

    // Listen for the custom storage change event
    window.addEventListener(STORAGE_CHANGE_EVENT, loadData);

    // Also listen for the standard storage event for cross-tab sync
    window.addEventListener('storage', loadData);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  return { clubs, events, loading, setClubs, setEvents };
}
