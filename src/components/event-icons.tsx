import type { EventCategory } from '@/lib/types';
import { BookOpen, Trophy, Users, Code2, Music, type LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export const CATEGORY_ICONS: Record<EventCategory, IconComponent> = {
  Academic: BookOpen,
  Sports: Trophy,
  Social: Users,
  Tech: Code2,
  Music: Music,
};

export const CategoryIcon = ({ category, className }: { category: EventCategory; className?: string }) => {
  const IconComponent = category ? CATEGORY_ICONS[category] : null;
  if (!IconComponent) {
    return null; // Return null to prevent rendering if the icon is not found
  }
  return <IconComponent className={className} />;
};