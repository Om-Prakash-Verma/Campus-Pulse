// Indicate that this component should only be rendered on the client-side.
"use client";

// Import necessary hooks and components from React and other libraries.
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Import UI components from the project's component library.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import schema types for form validation.
import type { LoginSchema, RegisterSchema } from "@/app/admin/page";
// Import data types used in the component.
import type { Club, EventCategory } from "@/lib/types";
// Import validation schemas for the login and registration forms.
import { loginSchema, registerSchema } from "./schemas";

// Define the props interface for the Auth component.
interface AuthProps {
    clubs: Club[]; // An array of available clubs.
    onLogin: SubmitHandler<LoginSchema>; // Callback function for login form submission.
    onRegister: SubmitHandler<RegisterSchema>; // Callback function for registration form submission.
}

/**
 * Auth component provides a user interface for club login and registration.
 * It features a tabbed layout to switch between the login and registration forms.
 *
 * @param {AuthProps} props - The props for the component.
 * @returns {JSX.Element} The rendered authentication form.
 */
export default function Auth({ clubs, onLogin, onRegister }: AuthProps) {
  // State to store the preview of the selected club logo.
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize the login form using react-hook-form and Zod for validation.
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', password: '' },
  });
  // Initialize the registration form using react-hook-form and Zod for validation.
  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', password: '', category: 'Social', logo: '' },
  });

  /**
   * Handles the change event for the logo input field.
   * It reads the selected file, generates a data URL, and updates the form state and logo preview.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
   */
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        registerForm.setValue('logo', result);
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handles the submission of the login form.
   * @param {LoginSchema} data - The login form data.
   */
  const handleLoginSubmit = (data: LoginSchema) => {
    onLogin(data);
  };

  /**
   * Handles the submission of the registration form.
   * @param {RegisterSchema} data - The registration form data.
   */
  const handleRegisterSubmit = (data: RegisterSchema) => {
    onRegister(data);
also    setLogoPreview(null);
  }

  return (
    <Card className="w-full max-w-md glassmorphism">
      <Tabs defaultValue="login" className="w-full">
        {/* Tab triggers for switching between login and registration */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        {/* Login tab content */}
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Club Login</CardTitle>
            <CardDescription>Select your club to manage events.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Login form */}
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                {/* Club name field */}
                <FormField
                  control={loginForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Autofill the password when a club is selected.
                          const selectedClub = clubs.find(c => c.name === value);
                          if (selectedClub) {
                            loginForm.setValue('password', selectedClub.password);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent">
                            <SelectValue placeholder="Select a club" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="glassmorphism">
                          {/* Populate the select with the list of clubs */}
                          {clubs.map((club) => (
                            <SelectItem key={club.id} value={club.name}>
                              {club.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password field */}
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="••••••••"
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </TabsContent>
        {/* Registration tab content */}
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Club Registration</CardTitle>
            <CardDescription>Create a new club account.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Registration form */}
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                {/* Club name field */}
                <FormField control={registerForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Club Name</FormLabel><FormControl><Input {...field} placeholder="e.g. Art Club" className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                )} />
                {/* Password field */}
                <FormField control={registerForm.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} placeholder="••••••••" className="bg-transparent" /></FormControl><FormMessage /></FormI tem>
                )} />
                {/* Club category field */}
                <FormField control={registerForm.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Club Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-transparent"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent className="glassmorphism">
                        {/* Populate the select with event categories */}
                        {(["Academic", "Sports", "Social", "Tech", "Music"] as EventCategory[]).map(cat =>
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />
                 {/* Club logo field */}
                 <FormItem>
                  <FormLabel>Club Logo</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleLogoChange} className="bg-transparent" />
                  </FormControl>
                  {/* Display the logo preview */}
                  {logoPreview && (
                    <div className="mt-4 flex justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={logoPreview} alt="Logo preview"/>
                        <AvatarFallback>Logo</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
                <Button type="submit" className="w-full">Register</Button>
              </form>
            </Form>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
