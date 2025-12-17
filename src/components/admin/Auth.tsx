"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import type { LoginSchema, RegisterSchema } from "@/app/admin/page";
import type { Club, EventCategory } from "@/lib/types";
import { loginSchema, registerSchema } from "./schemas";

interface AuthProps {
    clubs: Club[];
    onLogin: SubmitHandler<LoginSchema>;
    onRegister: SubmitHandler<RegisterSchema>;
}

export default function Auth({ clubs, onLogin, onRegister }: AuthProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', password: '' },
  });
  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', password: '', category: 'Social', logo: '' },
  });

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

  const handleLoginSubmit = (data: LoginSchema) => {
    onLogin(data);
  };

  const handleRegisterSubmit = (data: RegisterSchema) => {
    onRegister(data);
    setLogoPreview(null);
  }

  return (
    <Card className="w-full max-w-md glassmorphism">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Club Login</CardTitle>
            <CardDescription>Select your club to manage events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
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
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Club Registration</CardTitle>
            <CardDescription>Create a new club account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                <FormField control={registerForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Club Name</FormLabel><FormControl><Input {...field} placeholder="e.g. Art Club" className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={registerForm.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} placeholder="••••••••" className="bg-transparent" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={registerForm.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Club Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-transparent"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent className="glassmorphism">
                        {(["Academic", "Sports", "Social", "Tech", "Music"] as EventCategory[]).map(cat =>
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />
                 <FormItem>
                  <FormLabel>Club Logo</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleLogoChange} className="bg-transparent" />
                  </FormControl>
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
