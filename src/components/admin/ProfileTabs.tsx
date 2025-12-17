// Indicates that this file is a client-side component, making it compatible with React hooks.
"use client";

// Import core React hooks for state management.
import { useState } from 'react';
// Import hooks and types from react-hook-form for form handling and validation.
import { useForm, type SubmitHandler, useFieldArray } from 'react-hook-form';
// Import zodResolver for integrating Zod schema validation with react-hook-form.
import { zodResolver } from '@hookform/resolvers/zod';
// Import Zod for schema declaration and validation.
import { z } from 'zod';
// Import UI components for building the alert dialog.
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
// Import UI components for displaying avatars.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import button component.
import { Button } from "@/components/ui/button";
// Import card components for content organization.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Import form components for building forms.
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// Import table components for displaying data in a tabular format.
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Import textarea component for multi-line text input.
import { Textarea } from "@/components/ui/textarea";
// Import custom types for Club, Person, and ClubResource.
import type { Club, Person, ClubResource } from "@/lib/types";
// Import icons from lucide-react to be used in buttons and UI elements.
import { Edit, Save, Trash2, UserPlus, Link as LinkIcon, PlusCircle, Palette } from "lucide-react";
// Import the PersonForm component for adding or editing team members.
import PersonForm from "./PersonForm";
// Import a custom hook to display toast notifications.
import { useToast } from '@/hooks/use-toast';
// Import input component.
import { Input } from '../ui/input';

// Define a constant for the session storage key to manage club authentication.
const AUTH_SESSION_KEY = "campus-pulse-auth-club";

// Define the Zod schema for a club resource, used for validation.
const resourceSchema = z.object({
  id: z.string(), // Unique identifier for the resource.
  label: z.string().min(1, "Label is required"), // The display name for the link.
  url: z.string().url("Must be a valid URL"), // The URL of the resource.
});

// Define the Zod schema for the club's profile form.
export const profileSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters.").optional(), // Optional club description.
  resources: z.array(resourceSchema).optional(), // Optional array of club resources.
  themeColor: z.string().optional(), // Optional theme color for the club's profile.
});
// Infer the TypeScript type from the profile schema.
export type ProfileSchema = z.infer<typeof profileSchema>;

// Define the Zod schema for a person (team member).
export const personSchema = z.object({
    name: z.string().min(2, "Name is required"), // Name of the person.
    role: z.enum(['Leader', 'Member']), // Role within the club.
    email: z.string().email("Invalid email address").optional().or(z.literal('')), // Optional email.
    phone: z.string().optional(), // Optional phone number.
    branch: z.string().optional(), // Optional academic branch.
    department: z.string().optional(), // Optional department.
    avatar: z.string().optional(), // Optional URL for an avatar image.
});
// Infer the TypeScript type from the person schema.
export type PersonSchema = z.infer<typeof personSchema>;

// Define the props interface for the ProfileTabs component.
interface ProfileTabsProps {
    club: Club; // The current club's data.
    clubs: Club[]; // An array of all clubs.
    setClubs: (clubs: Club[]) => void; // Function to update the list of all clubs.
    setLoggedInClub: (club: Club) => void; // Function to update the currently logged-in club's data.
}

/**
 * A reusable component to display a table of team members.
 * @param people - An array of Person objects to display.
 * @param title - The title of the table.
 * @param onEdit - Callback function when the edit button is clicked.
 * @param onDelete - Callback function when the delete button is clicked.
 * @param onAdd - Callback function to add a new person.
 */
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
                                    {/* Edit button for a person */}
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(person)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    {/* Delete button for a person */}
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

/**
 * A component that renders the profile management tabs for a club admin.
 * It includes forms for updating the club profile and managing team members.
 */
export default function ProfileTabs({ club, clubs, setClubs, setLoggedInClub }: ProfileTabsProps) {
    // Hook for displaying toast notifications.
    const { toast } = useToast();
    // State to control the visibility of the PersonForm dialog.
    const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
    // State to hold the person object being edited.
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    // State to hold the ID of the person being considered for deletion.
    const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);
    
    // `react-hook-form` setup for the main profile form.
    const profileForm = useForm<ProfileSchema>({
      resolver: zodResolver(profileSchema), // Use Zod for validation.
      defaultValues: { 
        description: club.description,
        resources: club.resources || [],
        themeColor: club.themeColor || '#8B5CF6'
      }
    });

    // `useFieldArray` hook to manage the dynamic list of resources.
    const { fields, append, remove } = useFieldArray({
      control: profileForm.control,
      name: "resources"
    });

    // `react-hook-form` setup for the person form (add/edit member).
    const personForm = useForm<PersonSchema>({
      resolver: zodResolver(personSchema),
    });

    /**
     * Handles the submission of the club profile form.
     * Updates the club's data locally and in session storage.
     * @param data - The validated form data.
     */
    const handleProfileUpdate: SubmitHandler<ProfileSchema> = (data) => {
        // Create an updated club object with the new data.
        const updatedClub: Club = { ...club, ...data };
        
        // Update the clubs array with the modified club.
        const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
        setClubs(updatedClubs);
        setLoggedInClub(updatedClub);
        // Persist the updated club data in session storage.
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));

        // Show a success notification.
        toast({ title: "Profile Updated", description: "Your club profile has been saved." });
        profileForm.reset(data); // Sync form state with the new data.
    };
    
    /**
     * Opens the PersonForm dialog, either for adding a new person or editing an existing one.
     * @param person - The person to edit, or null to add a new person.
     */
    const handleOpenPersonForm = (person: Person | null) => {
        setEditingPerson(person); // Set the person being edited.
        if (person) {
            // If editing, reset the form with the person's existing data.
            personForm.reset(person);
        } else {
            // If adding, reset the form with default empty values.
            personForm.reset({
                name: '', role: 'Member', email: '', phone: '',
                branch: '', department: '', avatar: '',
            });
        }
        setIsPersonFormOpen(true); // Open the dialog.
    };
    
    /**
     * Handles the submission of the person form (add/edit).
     * @param data - The validated data for the new or updated person.
     */
    const handlePersonFormSubmit: SubmitHandler<PersonSchema> = (data) => {
        let updatedClub: Club;

        if (editingPerson) {
            // Logic for updating an existing person.
            const updatePerson = (people: Person[] = []) => 
                people.map(p => p.id === editingPerson.id ? { ...p, ...data } : p);
            
            updatedClub = {
                ...club,
                leaders: updatePerson(club.leaders),
                members: updatePerson(club.members),
            };
            toast({ title: "Team Member Updated" });
        } else {
            // Logic for adding a new person.
            const newPerson: Person = { id: Date.now().toString(), ...data }; // Create a new person object with a unique ID.
            updatedClub = { ...club };

            // Add the new person to the appropriate list based on their role.
            if (newPerson.role === 'Leader') {
                updatedClub.leaders = [...(updatedClub.leaders || []), newPerson];
            } else {
                updatedClub.members = [...(updatedClub.members || []), newPerson];
            }
            toast({ title: "Team Member Added" });
        }

        // Update the state and session storage with the modified club data.
        const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
        setClubs(updatedClubs);
        setLoggedInClub(updatedClub);
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));

        setIsPersonFormOpen(false); // Close the dialog.
    };

    /**
     * Handles the deletion of a team member after confirmation.
     */
    const handleDeletePerson = () => {
        if (!deletingPersonId) return;

        // Helper function to filter out the deleted person.
        const filterPerson = (people: Person[] = []) => people.filter(p => p.id !== deletingPersonId);

        // Create an updated club object without the deleted member.
        const updatedClub: Club = {
            ...club,
            leaders: filterPerson(club.leaders),
            members: filterPerson(club.members),
        };
        
        // Update state and session storage.
        const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
        setClubs(updatedClubs);
        setLoggedInClub(updatedClub);
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));

        // Show a success notification and close the confirmation dialog.
        toast({ title: "Team Member Deleted" });
        setDeletingPersonId(null);
    };

    // Combine leaders and members into a single array for the team table.
    const allMembers = [...(club.leaders || []), ...(club.members || [])];
    
    return (
        <>
          {/* Card for editing the main club profile */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Edit Club Profile</CardTitle>
              <CardDescription>Update your club's public information, branding, and resources.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Profile update form */}
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-8">
                  {/* Club Description Field */}
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

                  {/* Theme Color Field */}
                  <FormField
                    control={profileForm.control}
                    name="themeColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Palette/> Theme Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                             {/* Color picker input */}
                             <Input 
                                type="color" 
                                {...field} 
                                className="w-12 h-10 p-1 bg-transparent"
                                value={field.value || ''}
                              />
                             {/* Text input for hex color */}
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

                  {/* Club Resources Field Array */}
                  <div>
                    <FormLabel className="flex items-center gap-2 mb-2"><LinkIcon/> Resources</FormLabel>
                    <div className="space-y-4">
                      {/* Map through the resource fields */}
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          {/* Resource Label Field */}
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
                           {/* Resource URL Field */}
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
                          {/* Button to remove a resource */}
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        </div>
                      ))}
                    </div>
                     {/* Button to add a new resource */}
                     <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: Date.now().toString(), label: '', url: '' })}>
                        <PlusCircle className="mr-2"/> Add Resource
                      </Button>
                  </div>

                  {/* Submit button for the profile form */}
                  <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

            {/* Section for Team Management */}
            <div className="glassmorphism rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">Team Management</h3>
                {/* Team table component */}
                <TeamTable 
                    people={allMembers}
                    title="All Members"
                    onEdit={handleOpenPersonForm}
                    onDelete={setDeletingPersonId}
                    onAdd={() => handleOpenPersonForm(null)}
                />
            </div>
            
            {/* Dialog for adding/editing a person */}
            <PersonForm
                isOpen={isPersonFormOpen}
                setIsOpen={setIsPersonFormOpen}
                editingPerson={editingPerson}
                form={personForm}
                onSubmit={handlePersonFormSubmit}
            />

            {/* Confirmation dialog for deleting a person */}
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
