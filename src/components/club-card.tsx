
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CategoryIcon } from './event-icons';
import type { Club } from '@/lib/types';
import { Button } from './ui/button';

interface ClubCardProps {
    club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
    return (
        <Link href={`/${club.slug}`} className="flex h-full">
            <Card className="glassmorphism group flex w-full flex-col overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 hover:scale-[0.98]">
                <CardHeader className="items-center text-center">
                    <div className="relative">
                        <Avatar className="h-24 w-24 mb-4 border-4 border-transparent group-hover:border-accent transition-all duration-300">
                            {club.logo ? (
                                <AvatarImage src={club.logo} alt={club.name} className="transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                                <AvatarFallback className="transition-transform duration-300 group-hover:scale-110">
                                    <CategoryIcon category={club.category} className="h-10 w-10 text-muted-foreground" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                    <CardTitle className="text-xl">{club.name}</CardTitle>
                    <p className="text-sm font-semibold text-accent">{club.category}</p>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <CardDescription className="line-clamp-3">
                        {club.description}
                    </CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                   <Button variant="outline" className="w-full">View Page</Button>
                </div>
            </Card>
        </Link>
    );
}
