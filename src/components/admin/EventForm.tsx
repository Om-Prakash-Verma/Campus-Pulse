"use client";

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

interface EventFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    editingEvent: any | null;
    form: UseFormReturn<EventSchema>;
    onSubmit: SubmitHandler<EventSchema>;
}

export default function EventForm({ isOpen, setIsOpen, editingEvent, form, onSubmit }: EventFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(form.watch('image') || null);

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

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setImagePreview(null);
            form.reset();
        }
    };
    
    // Sync preview with form state on open
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
                    <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="tags" render={({ field }) => (
                        <FormItem><FormLabel>Tags</FormLabel><FormControl><Input {...field} className="bg-transparent" placeholder="e.g. python, workshop, competition" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-4">
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
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="registrationLink" render={({ field }) => (
                        <FormItem><FormLabel>Registration Link</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormItem>
                        <FormLabel>Event Image</FormLabel>
                        <FormControl>
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="bg-transparent" />
                        </FormControl>
                        {imagePreview && (
                        <div className="mt-4 relative w-full h-48">
                            <Image src={imagePreview} alt="Image preview" fill className="rounded-md object-cover" />
                        </div>
                        )}
                        <FormMessage />
                    </FormItem>
                    <Button type="submit">{editingEvent ? "Save Changes" : "Create Event"}</Button>
                    </form>
                </Form>
            </DialogContent>
      </Dialog>
    )
}
