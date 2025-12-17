// Import the EventCategory type from the types library.
import type { EventCategory } from '@/lib/types';
// Import icon components from the lucide-react library.
import { BookOpen, Trophy, Users, Code2, Music, type LucideProps } from 'lucide-react';
// Import React types.
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Define the type for the icon components.
type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// Create a mapping from event categories to icon components.
export const CATEGORY_ICONS: Record<EventCategory, IconComponent> = {
  Academic: BookOpen,
  Sports: Trophy,
  Social: Users,
  Tech: Code2,
  Music: Music,
};

// A component that renders an icon for a given event category.
export const CategoryIcon = ({ category, className }: { category: EventCategory; className?: string }) => {
  // Get the icon component for the given category.
  const IconComponent = category ? CATEGORY_ICONS[category] : null;
  // If no icon component is found, return null to prevent rendering.
  if (!IconComponent) {
    return null; // Return null to prevent rendering if the icon is not found
  }
  // Render the icon component with the given class name.
  return <IconComponent className={className} />;
};
