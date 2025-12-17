"use client";

import { useState } from "react";
import { type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PersonSchema } from "@/app/admin/page";

interface PersonFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    editingPerson: any | null;
    form: UseFormReturn<PersonSchema>;
    onSubmit: SubmitHandler<PersonSchema>;
}

export default function PersonForm({ isOpen, setIsOpen, editingPerson, form, onSubmit }: PersonFormProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(form.watch('avatar') || null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                form.setValue('avatar', result);
                setAvatarPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setAvatarPreview(null);
            form.reset();
        }
    };

    if(isOpen && !avatarPreview && form.getValues('avatar')) {
        setAvatarPreview(form.getValues('avatar')!);
    }
    if(!isOpen && avatarPreview) {
        setAvatarPreview(null);
    }


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="glassmorphism">
                <DialogHeader>
                    <DialogTitle>{editingPerson ? "Edit Member" : "Add New Member"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
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
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="branch" render={({ field }) => (
                            <FormItem><FormLabel>Branch</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="department" render={({ field }) => (
                            <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={handleAvatarChange} className="bg-transparent" />
                            </FormControl>
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
                        <Button type="submit">{editingPerson ? "Save Changes" : "Add Member"}</Button>
                    </form>
                </Form>
            </DialogContent>
      </Dialog>
    );
}
