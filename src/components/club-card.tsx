

// Import necessary components and types.
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CategoryIcon } from './event-icons';
import type { Club } from '@/lib/types';
import { Button } from './ui/button';

// Define the props for the ClubCard component.
interface ClubCardProps {
    club: Club; // The club object to display.
}

/**
 * A card component that displays information about a club.
 * @param {ClubCardProps} props The props for the component.
 * @returns {JSX.Element} A JSX element representing the club card.
 */
export function ClubCard({ club }: ClubCardProps) {
    return (
        // Link to the club's page.
        <Link href={`/${club.slug}`} className="flex h-full">
            {/* The card component that contains the club information. */}
            <Card className="glassmorphism group flex w-full flex-col overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 hover:scale-[0.98]">
                <CardHeader className="items-center text-center">
                    <div className="relative">
                        {/* The avatar for the club's logo. */}
                        <Avatar className="h-24 w-24 mb-4 border-4 border-transparent group-hover:border-accent transition-all duration-300">
                            {club.logo ? (
                                // If the club has a logo, display it.
                                <AvatarImage src={club.logo} alt={club.name} className="transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                                // Otherwise, display a fallback icon.
                                <AvatarFallback className="transition-transform duration-300 group-hover:scale-110">
                                    <CategoryIcon category={club.category} className="h-10 w-10 text-muted-foreground" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                    {/* The name of the club. */}
                    <CardTitle className="text-xl">{club.name}</CardTitle>
                    {/* The category of the club. */}
                    <p className="text-sm font-semibold text-accent">{club.category}</p>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    {/* The description of the club. */}
                    <CardDescription className="line-clamp-3">
                        {club.description}
                    </CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                    {/* A button to view the club's page. */}
                   <Button variant="outline" className="w-full">View Page</Button>
                </div>
            </Card>
        </Link>
    );
}
