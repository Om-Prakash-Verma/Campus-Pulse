import { slugify } from './utils';
import type { Event, Club } from './types';

function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(18, 0, 0, 0); // Set time to 6 PM
  return date.toISOString();
}

// Initial club data
export const initialClubs: Club[] = [
  { id: 'tech-club', slug: 'tech-club', name: 'Tech Club', password: 'tech', category: 'Tech', logo: '', description: 'The official hub for all tech enthusiasts on campus. We explore everything from coding to AI.', expenses: [], monthlyBudget: 500, resources: [] },
  { id: 'sports-club', slug: 'sports-club', name: 'Sports Club', password: 'sports', category: 'Sports', logo: '', description: 'Home of campus champions. Join us for a variety of sports and fitness activities.', expenses: [], monthlyBudget: 1000, resources: [] },
  { id: 'music-club', slug: 'music-club', name: 'Music Club', password: 'music', category: 'Music', logo: '', description: 'Where melodies come to life. We host jam sessions, concerts, and music workshops.', expenses: [], monthlyBudget: 300, resources: [] },
  { id: 'social-club', slug: 'social-club', name: 'Social Club', password: 'social', category: 'Social', logo: '', description: 'Connecting students through fun and engaging social events. Make new friends and create lasting memories.', expenses: [], monthlyBudget: 750, resources: [] },
  { id: 'academic-club', slug: 'academic-club', name: 'Academic Club', password: 'academic', category: 'Academic', logo: '', description: 'Fostering intellectual growth. We organize seminars, workshops, and study groups.', expenses: [], monthlyBudget: 250, resources: [] },
];

export const initialEvents: Event[] = [
  {
    id: '1',
    clubId: 'tech-club',
    slug: 'annual-tech-summit-2024',
    title: 'Annual Tech Summit 2024',
    description: 'Join us for a day of insightful talks and workshops from leaders in the tech industry. A must-attend for aspiring developers and entrepreneurs.',
    date: getFutureDate(7),
    location: 'Main Auditorium',
    category: 'Tech',
    registrationLink: '#',
    image: 'https://picsum.photos/seed/tech/600/400'
  },
  {
    id: '2',
    clubId: 'sports-club',
    slug: 'inter-college-football-championship',
    title: 'Inter-College Football Championship',
    description: 'Cheer for your college team in the most anticipated sports event of the year. Witness thrilling matches and spectacular goals.',
    date: getFutureDate(12),
    location: 'University Sports Ground',
    category: 'Sports',
    registrationLink: '#',
    image: 'https://picsum.photos/seed/sports/600/400'
  },
  {
    id: '3',
    clubId: 'academic-club',
    slug: 'quantum-physics-seminar',
    title: 'Quantum Physics Seminar',
    description: 'A deep dive into the world of quantum mechanics with guest speaker Dr. Evelyn Reed. Expand your understanding of the universe.',
    date: getFutureDate(20),
    location: 'Science Block, Hall C',
    category: 'Academic',
    registrationLink: '#',
    image: 'https://picsum.photos/seed/academic/600/400'
  },
  {
    id: '4',
    clubId: 'music-club',
    slug: 'spring-fest-music-night',
    title: 'Spring Fest Music Night',
    description: 'An unforgettable night of live music featuring student bands and a headline performance by a surprise guest artist. Don\'t miss out!',
    date: getFutureDate(25),
    location: 'Central Plaza',
    category: 'Music',
    registrationLink: '#',
    image: 'https://picsum.photos/seed/music/600/400'
  },
  {
    id: '5',
    clubId: 'social-club',
    slug: 'charity-gala-and-social-mixer',
    title: 'Charity Gala & Social Mixer',
    description: 'A beautiful evening dedicated to a good cause. Mingle with fellow students and faculty, with all proceeds going to local charities.',
    date: getFutureDate(30),
    location: 'Grand Ballroom',
    category: 'Social',
    registrationLink: '#',
    image: 'https://picsum.photos/seed/social/600/400'
  }
];

export type { Event, EventCategory, Club } from './types';
