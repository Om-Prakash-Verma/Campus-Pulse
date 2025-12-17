// This marks the file as a Client Component, making it usable in Next.js App Router.
"use client";

// Import necessary React hooks and types.
import { useState, useEffect, useCallback } from 'react';
// Import initial data for clubs and events.
import { initialClubs, initialEvents } from '@/lib/events';
// Import data structure types.
import type { Club, Event } from '@/lib/types';

// Define keys for storing data in localStorage.
const EVENTS_STORAGE_KEY = "campus-pulse-events";
const CLUBS_STORAGE_KEY = "campus-pulse-clubs";
// Define a custom event name for signaling storage changes within the same tab.
const STORAGE_CHANGE_EVENT = "storageChange";

/**
 * Custom hook to manage application data (clubs and events).
 * It handles fetching and storing data from localStorage,
 * and ensures data consistency across different components and browser tabs.
 * @returns An object containing clubs, events, loading state, and functions to update them.
 */
export function useData() {
  // State for storing the list of clubs.
  const [clubs, setClubsState] = useState<Club[]>([]);
  // State for storing the list of events.
  const [events, setEventsState] = useState<Event[]>([]);
  // State to indicate if data is currently being loaded.
  const [loading, setLoading] = useState(true);

  /**
   * Dispatches a custom event to notify components about a change in localStorage.
   * This is useful for triggering updates in components that use this hook.
   */
  const dispatchStorageChange = () => {
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  };

  /**
   * Updates the clubs' state and persists it to localStorage.
   * useCallback is used to memoize the function for performance optimization.
   */
  const setClubs = useCallback((newClubs: Club[]) => {
    setClubsState(newClubs);
    localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(newClubs));
    dispatchStorageChange();
  }, []);

  /**
   * Updates the events' state and persists it to localStorage.
   * useCallback is used to memoize the function for performance optimization.
   */
  const setEvents = useCallback((newEvents: Event[]) => {
    setEventsState(newEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
    dispatchStorageChange();
  }, []);

  // Effect hook to load data on initial render and set up event listeners.
  useEffect(() => {
    /**
     * Loads club and event data from localStorage.
     * If no data is found, it initializes localStorage with initial data.
     */
    const loadData = () => {
      setLoading(true);
      // Load clubs from localStorage or use initial data.
      const storedClubs = localStorage.getItem(CLUBS_STORAGE_KEY);
      if (storedClubs) {
        setClubsState(JSON.parse(storedClubs));
      } else {
        setClubsState(initialClubs);
        localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(initialClubs));
      }

      // Load events from localStorage or use initial data.
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        setEventsState(JSON.parse(storedEvents));
      } else {
        setEventsState(initialEvents);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
      }
      setLoading(false);
    };

    // Load data when the component mounts.
    loadData();

    // Add an event listener for our custom storage change event.
    // This ensures components within the same tab react to data changes.
    window.addEventListener(STORAGE_CHANGE_EVENT, loadData);

    // Add an event listener for the standard 'storage' event.
    // This syncs data changes across different browser tabs.
    window.addEventListener('storage', loadData);

    // Cleanup function to remove event listeners when the component unmounts.
    // This prevents memory leaks.
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Return the state and functions to be used by components.
  return { clubs, events, loading, setClubs, setEvents };
}
