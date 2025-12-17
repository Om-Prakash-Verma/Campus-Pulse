// Mark this component as a Client Component
"use client";

// Import necessary hooks and components from React and other libraries
import { useForm, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { ExpenseSchema } from "./ExpensesTab";
import type { Expense, Event } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the properties for the ExpenseForm component
interface ExpenseFormProps {
    isOpen: boolean; // Flag to control the visibility of the dialog
    setIsOpen: (isOpen: boolean) => void; // Function to update the visibility of the dialog
    editingExpense: Expense | null; // The expense being edited, or null if creating a new one
    form: UseFormReturn<ExpenseSchema>; // The form instance from react-hook-form
    onSubmit: SubmitHandler<ExpenseSchema>; // The function to handle form submission
    clubEvents: Event[]; // An array of events to choose from
}

// Define the ExpenseForm component
export default function ExpenseForm({ isOpen, setIsOpen, editingExpense, form, onSubmit, clubEvents }: ExpenseFormProps) {

    // Handle changes to the dialog's open state
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        // If the dialog is closing, reset the form
        if (!open) {
            form.reset();
        }
    };

    // Render the component
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="glassmorphism">
                <DialogHeader>
                    {/* Set the dialog title based on whether an expense is being edited or created */}
                    <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                </DialogHeader>
                {/* Render the form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
                        {/* Form field for the expense name */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Expense Name</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        {/* Form field for selecting an associated event */}
                        <FormField
                            control={form.control}
                            name="eventId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Event (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="bg-transparent">
                                        <SelectValue placeholder="Link to an event" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glassmorphism">
                                    {/* Option to select no event */}
                                    <SelectItem value="none">None</SelectItem>
                                    {/* Map over the club events and create a SelectItem for each */}
                                    {clubEvents.map(event => (
                                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Container for the amount and date fields */}
                        <div className="flex gap-4">
                            {/* Form field for the expense amount */}
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem className="flex-grow"><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                            )} />
                            {/* Form field for the expense date */}
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
                                            {/* Display the selected date or a placeholder */}
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
                                        {/* Calendar for selecting a date */}
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            // Disable dates in the future or before 2000-01-01
                                            disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit button */}
                        <Button type="submit">{editingExpense ? "Save Changes" : "Add Expense"}</Button>
                    </form>
                </Form>
            </DialogContent>
      </Dialog>
    )
}
