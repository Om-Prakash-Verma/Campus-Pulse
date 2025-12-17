// Mark this component as a Client Component
"use client";

// Import necessary hooks and components from React and other libraries
import { useState } from "react";
import { type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PersonSchema } from "@/app/admin/page";

// Define the props for the PersonForm component
interface PersonFormProps {
    isOpen: boolean; // Flag to control the visibility of the dialog
    setIsOpen: (isOpen: boolean) => void; // Function to update the visibility of the dialog
    editingPerson: any | null; // The person object to edit, or null if adding a new person
    form: UseFormReturn<PersonSchema>; // The form object from react-hook-form
    onSubmit: SubmitHandler<PersonSchema>; // The function to handle form submission
}

/**
 * A form component for adding or editing a person's information.
 * It is displayed as a dialog.
 * @param {PersonFormProps} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function PersonForm({ isOpen, setIsOpen, editingPerson, form, onSubmit }: PersonFormProps) {
    // State to store the preview of the avatar image
    const [avatarPreview, setAvatarPreview] = useState<string | null>(form.watch('avatar') || null);

    /**
     * Handles the change event of the avatar input field.
     * It reads the selected file and updates the form value and the avatar preview.
     * @param {React.ChangeEvent<HTMLInputElement>} e The change event object.
     */
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                form.setValue('avatar', result); // Set the avatar value in the form
                setAvatarPreview(result); // Update the avatar preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };
    
    /**
     * Handles the change event of the dialog's open state.
     * It resets the form and the avatar preview when the dialog is closed.
     * @param {boolean} open The new open state of the dialog.
     */
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setAvatarPreview(null); // Clear the avatar preview
            form.reset(); // Reset the form
        }
    };

    // When the dialog is opened to edit a person, set the avatar preview
    if(isOpen && !avatarPreview && form.getValues('avatar')) {
        setAvatarPreview(form.getValues('avatar')!);
    }
    // When the dialog is closed, clear the avatar preview
    if(!isOpen && avatarPreview) {
        setAvatarPreview(null);
    }


    // Render the component
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="glassmorphism">
                <DialogHeader>
                    {/* Set the dialog title based on whether a person is being edited or added */}
                    <DialogTitle>{editingPerson ? "Edit Member" : "Add New Member"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    {/* The form for adding or editing a person */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
                        {/* Form field for the person's name */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        {/* Form field for the person's role */}
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem><FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent className="glassmorphism">
                                        <SelectItem value="Leader">Leader</SelectItem>
                                        <SelectItem value="Member">Member</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                        )} />
                        {/* Form field for the person's email */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        {/* Form field for the person's phone number */}
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        {/* Form field for the person's branch */}
                        <FormField control={form.control} name="branch" render={({ field }) => (
                            <FormItem><FormLabel>Branch</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormMessage>
                        )} />
                        {/* Form field for the person's department */}
                        <FormField control={form.control} name="department" render={({ field }) => (
                            <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        {/* Form field for the person's avatar */}
                        <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={handleAvatarChange} className="bg-transparent" />
                            </FormControl>
                            {/* Display the avatar preview if it exists */}
                            {avatarPreview && (
                                <div className="mt-4 flex justify-center">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={avatarPreview} alt="Avatar preview"/>
                                        <AvatarFallback>Avatar</AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                        {/* Submit button */}
                        <Button type="submit">{editingPerson ? "Save Changes" : "Add Member"}</Button>
                    </form>
                </Form>
            </DialogContent>
      </Dialog>
    );
}