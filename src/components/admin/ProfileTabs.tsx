"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Club, Person, ClubResource } from "@/lib/types";
import { Edit, Save, Trash2, UserPlus, Link as LinkIcon, PlusCircle, Palette } from "lucide-react";
import PersonForm from "./PersonForm";
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

const AUTH_SESSION_KEY = "campus-pulse-auth-club";

const resourceSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL"),
});

export const profileSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters.").optional(),
  resources: z.array(resourceSchema).optional(),
  themeColor: z.string().optional(),
});
export type ProfileSchema = z.infer<typeof profileSchema>;

export const personSchema = z.object({
    name: z.string().min(2, "Name is required"),
    role: z.enum(['Leader', 'Member']),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().optional(),
    branch: z.string().optional(),
    department: z.string().optional(),
    avatar: z.string().optional(),
});
export type PersonSchema = z.infer<typeof personSchema>;

interface ProfileTabsProps {
    club: Club;
    clubs: Club[];
    setClubs: (clubs: Club[]) => void;
    setLoggedInClub: (club: Club) => void;
}

const TeamTable = ({ people, title, onEdit, onDelete, onAdd }: { people: Person[], title: string, onEdit: (person: Person) => void, onDelete: (id: string) => void, onAdd: () => void }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button size="sm" onClick={onAdd}><UserPlus className="mr-2 h-4 w-4"/>Add</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {people?.length > 0 ? (
                        people.map((person) => (
                            <TableRow key={person.id}>
                                <TableCell className="font-medium flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={person.avatar} alt={person.name} />
                                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {person.name}
                                </TableCell>
                                <TableCell>{person.role}</TableCell>
                                <TableCell>{person.email || person.phone}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(person)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(person.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">No one here yet. Add someone!</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
    </Card>
);

export default function ProfileTabs({ club, clubs, setClubs, setLoggedInClub }: ProfileTabsProps) {
    const { toast } = useToast();
    const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);
    
    const profileForm = useForm<ProfileSchema>({
      resolver: zodResolver(profileSchema),
      defaultValues: { 
        description: club.description,
        resources: club.resources || [],
        themeColor: club.themeColor || '#8B5CF6'
      }
    });

    const { fields, append, remove } = useFieldArray({
      control: profileForm.control,
      name: "resources"
    });

    const personForm = useForm<PersonSchema>({
      resolver: zodResolver(personSchema),
    });

    const handleProfileUpdate: SubmitHandler<ProfileSchema> = (data) => {
        const updatedClub: Club = { ...club, ...data };
        
        const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
        setClubs(updatedClubs);
        setLoggedInClub(updatedClub);
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));

        toast({ title: "Profile Updated", description: "Your club profile has been saved." });
        profileForm.reset(data); // keep form synced
    };
    
    const handleOpenPersonForm = (person: Person | null) => {
        setEditingPerson(person);
        if (person) {
            personForm.reset(person);
        } else {
            personForm.reset({
                name: '', role: 'Member', email: '', phone: '',
                branch: '', department: '', avatar: '',
            });
        }
        setIsPersonFormOpen(true);
    };
    
    const handlePersonFormSubmit: SubmitHandler<PersonSchema> = (data) => {
        let updatedClub: Club;

        if (editingPerson) {
            const updatePerson = (people: Person[] = []) => 
                people.map(p => p.id === editingPerson.id ? { ...p, ...data } : p);
            
            updatedClub = {
                ...club,
                leaders: updatePerson(club.leaders),
                members: updatePerson(club.members),
            };
            toast({ title: "Team Member Updated" });
        } else {
            const newPerson: Person = { id: Date.now().toString(), ...data };
            updatedClub = { ...club };

            if (newPerson.role === 'Leader') {
                updatedClub.leaders = [...(updatedClub.leaders || []), newPerson];
            } else {
                updatedClub.members = [...(updatedClub.members || []), newPerson];
            }
            toast({ title: "Team Member Added" });
        }

        const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
        setClubs(updatedClubs);
        setLoggedInClub(updatedClub);
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));

        setIsPersonFormOpen(false);
    };

    const handleDeletePerson = () => {
        if (!deletingPersonId) return;

        const filterPerson = (people: Person[] = []) => people.filter(p => p.id !== deletingPersonId);

        const updatedClub: Club = {
            ...club,
            leaders: filterPerson(club.leaders),
            members: filterPerson(club.members),
        };
        
        const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
        setClubs(updatedClubs);
        setLoggedInClub(updatedClub);
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));

        toast({ title: "Team Member Deleted" });
        setDeletingPersonId(null);
    };

    const allMembers = [...(club.leaders || []), ...(club.members || [])];
    
    return (
        <>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Edit Club Profile</CardTitle>
              <CardDescription>Update your club's public information, branding, and resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-8">
                  <FormField
                    control={profileForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={5}
                            className="bg-transparent"
                            placeholder="Tell everyone what your club is about..."
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="themeColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Palette/> Theme Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                             <Input 
                                type="color" 
                                {...field} 
                                className="w-12 h-10 p-1 bg-transparent"
                                value={field.value || ''}
                              />
                             <Input 
                                type="text" 
                                {...field} 
                                className="bg-transparent w-32"
                                value={field.value || ''}
                                placeholder="#8B5CF6"
                              />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel className="flex items-center gap-2 mb-2"><LinkIcon/> Resources</FormLabel>
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <FormField
                            control={profileForm.control}
                            name={`resources.${index}.label`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl><Input {...field} placeholder="Label (e.g. Website)" className="bg-transparent" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={profileForm.control}
                            name={`resources.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl><Input {...field} placeholder="URL (e.g. https://...)" className="bg-transparent" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        </div>
                      ))}
                    </div>
                     <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: Date.now().toString(), label: '', url: '' })}>
                        <PlusCircle className="mr-2"/> Add Resource
                      </Button>
                  </div>

                  <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

            <div className="glassmorphism rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">Team Management</h3>
                <TeamTable 
                    people={allMembers}
                    title="All Members"
                    onEdit={handleOpenPersonForm}
                    onDelete={setDeletingPersonId}
                    onAdd={() => handleOpenPersonForm(null)}
                />
            </div>
            
            <PersonForm
                isOpen={isPersonFormOpen}
                setIsOpen={setIsPersonFormOpen}
                editingPerson={editingPerson}
                form={personForm}
                onSubmit={handlePersonFormSubmit}
            />

            <AlertDialog open={!!deletingPersonId} onOpenChange={() => setDeletingPersonId(null)}>
                <AlertDialogContent className="glassmorphism">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this member from your club.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePerson} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
