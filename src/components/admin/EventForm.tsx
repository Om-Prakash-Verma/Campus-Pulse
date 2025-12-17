// Mark this component as a Client Component
"use client";

// Import necessary hooks and components from React and other libraries
import { useState } from "react";
import { useForm, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { EventSchema } from "./EventTabs";

// Define the properties for the EventForm component
interface EventFormProps {
    isOpen: boolean; // Controls whether the dialog is open
    setIsOpen: (isOpen: boolean) => void; // Function to change the dialog's open state
    editingEvent: any | null; // The event being edited, or null if creating a new event
    form: UseFormReturn<EventSchema>; // The form object from react-hook-form
    onSubmit: SubmitHandler<EventSchema>; // The function to call when the form is submitted
}

/**
 * A form for creating and editing events, displayed in a dialog.
 * @param {EventFormProps} props The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function EventForm({ isOpen, setIsOpen, editingEvent, form, onSubmit }: EventFormProps) {
    // State to hold the image preview URL
    const [imagePreview, setImagePreview] = useState<string | null>(form.watch('image') || null);

    /**
     * Handles the change event for the image input.
     * Reads the selected file and updates the form state and image preview.
     * @param {React.ChangeEvent<HTMLInputElement>} e The change event.
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                form.setValue('image', result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Handles the change event for the dialog's open state.
     * Resets the form and image preview when the dialog is closed.
     * @param {boolean} open The new open state.
     */
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setImagePreview(null);
            form.reset();
        }
    };
    
    // Sync the image preview with the form state when the dialog is opened or closed.
    if(isOpen && !imagePreview && form.getValues('image')) {
        setImagePreview(form.getValues('image')!);
    }
    if(!isOpen && imagePreview) {
        setImagePreview(null);
    }


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="glassmorphism">
                <DialogHeader>
                    {/* Set the dialog title based on whether an event is being edited or created */}
                    <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
                    {/* Form field for the event title */}
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    {/* Form field for the event description */}
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    {/* Form field for the event tags */}
                    <FormField control={form.control} name="tags" render={({ field }) => (
                        <FormItem><FormLabel>Tags</FormLabel><FormControl><Input {...field} className="bg-transparent" placeholder="e.g. python, workshop, competition" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-4">
                        {/* Form field for the event date */}
                        <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col flex-grow">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal bg-transparent",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form field for the event time */}
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-24">
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} className="bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Form field for the event location */}
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    {/* Form field for the event registration link */}
                    <FormField control={form.control} name="registrationLink" render={({ field }) => (
                        <FormItem><FormLabel>Registration Link</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    {/* Form field for the event image */}
                    <FormItem>
                        <FormLabel>Event Image</FormLabel>
                        <FormControl>
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="bg-transparent" />
                        </FormControl>
                        {/* Display the image preview if an image has been selected */}
                        {imagePreview && (
                        <div className="mt-4 relative w-full h-48">
                            <Image src={imagePreview} alt="Image preview" fill className="rounded-md object-cover" />
                        </div>
                        )}
                        <FormMessage />
                    </FormItem>
                    {/* Submit button for the form */}
                    <Button type="submit">{editingEvent ? "Save Changes" : "Create Event"}</Button>
                    </form>
                </Form>
            </DialogContent>
      </Dialog>
    )
}
