
"use client";

import { useState, useMemo, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format, subMonths, isSameMonth } from 'date-fns';
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, PlusCircle, Trash2, Save } from "lucide-react";
import type { Expense, Club, Event } from "@/lib/types";
import ExpenseForm from "./ExpenseForm";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

// Define a key for storing club authentication data in session storage.
const AUTH_SESSION_KEY = "campus-pulse-auth-club";

// Define the schema for expense validation using Zod.
export const expenseSchema = z.object({
  name: z.string().min(2, "Expense name is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  date: z.date({ required_error: "A date is required." }),
  eventId: z.string().optional(),
});
export type ExpenseSchema = z.infer<typeof expenseSchema>;

// Define the props for the ExpensesTab component.
interface ExpensesTabProps {
    club: Club;
    clubEvents: Event[];
    clubs: Club[];
    setClubs: (clubs: Club[]) => void;
    setLoggedInClub: (club: Club) => void;
}

// Define the ExpensesTab component.
export default function ExpensesTab({ club, clubEvents, clubs, setClubs, setLoggedInClub }: ExpensesTabProps) {
    const { toast } = useToast();
    const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
    const budgetInputRef = useRef<HTMLInputElement>(null);

    const expenseForm = useForm<ExpenseSchema>({
        resolver: zodResolver(expenseSchema),
    });

    const expenses = club.expenses || [];
    const monthlyBudget = club.monthlyBudget || 0;

    // Open the expense form, optionally with an expense to edit.
    const handleOpenExpenseForm = (expense: Expense | null) => {
        setEditingExpense(expense);
        if (expense) {
            expenseForm.reset({ ...expense, date: new Date(expense.date), eventId: expense.eventId || 'none' });
        } else {
            expenseForm.reset({ name: '', amount: 0, date: new Date(), eventId: 'none' });
        }
        setIsExpenseFormOpen(true);
    };

    // Update the club data in the list of clubs and in session storage.
    const handleUpdateClub = (updatedClub: Club) => {
      const updatedClubs = clubs.map(c => c.id === club.id ? updatedClub : c);
      setClubs(updatedClubs);
      setLoggedInClub(updatedClub);
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedClub));
    }

    // Update the club's monthly budget.
    const handleBudgetUpdate = () => {
      const newBudget = budgetInputRef.current?.value;
      const budgetValue = parseFloat(newBudget || '0');
      if (!isNaN(budgetValue) && budgetValue >= 0) {
        handleUpdateClub({...club, monthlyBudget: budgetValue });
        toast({ title: 'Budget Updated', description: `Monthly budget set to ${budgetValue.toFixed(2)}.` });
      } else {
        toast({ variant: 'destructive', title: 'Invalid Budget', description: 'Please enter a valid number for the budget.' });
      }
    };

    // Handle the submission of the expense form.
    const handleExpenseFormSubmit: SubmitHandler<ExpenseSchema> = (data) => {
        let updatedClub: Club;

        if (editingExpense) {
            const updatedExpense = { 
                ...editingExpense, 
                ...data, 
                date: data.date.toISOString(),
                eventId: data.eventId === "none" ? undefined : data.eventId 
            };
            updatedClub = {
                ...club,
                expenses: club.expenses?.map(e => e.id === editingExpense.id ? updatedExpense : e) || [],
            };
            toast({ title: "Expense Updated" });
        } else {
            const newExpense: Expense = {
                id: Date.now().toString(),
                ...data,
                date: data.date.toISOString(),
                eventId: data.eventId === "none" ? undefined : data.eventId 
            };
            updatedClub = {
                ...club,
                expenses: [...(club.expenses || []), newExpense],
            };
            toast({ title: "Expense Added" });
        }

        handleUpdateClub(updatedClub);
        setIsExpenseFormOpen(false);
    };

    // Delete an expense.
    const handleDeleteExpense = () => {
        if (!deletingExpenseId) return;

        const updatedClub: Club = {
            ...club,
            expenses: club.expenses?.filter(e => e.id !== deletingExpenseId) || [],
        };
        
        handleUpdateClub(updatedClub);
        toast({ title: "Expense Deleted" });
        setDeletingExpenseId(null);
    };
    
    // Memoize the sorted expenses.
    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses]);
    
    // Memoize the chart data.
    const chartData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i));
        const monthlyTotals = last6Months.map(month => ({
            name: format(month, 'MMM'),
            total: expenses
                .filter(e => format(new Date(e.date), 'yyyy-MM') === format(month, 'yyyy-MM'))
                .reduce((sum, e) => sum + e.amount, 0)
        })).reverse();

        return monthlyTotals;
    }, [expenses]);

    // Memoize the current month's spending.
    const currentMonthSpending = useMemo(() => {
        const now = new Date();
        return expenses
            .filter(e => isSameMonth(new Date(e.date), now))
            .reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);
    
    const remainingBudget = monthlyBudget - currentMonthSpending;
    const budgetProgress = monthlyBudget > 0 ? (currentMonthSpending / monthlyBudget) * 100 : 0;


    // Configure the chart.
    const chartConfig = {
      total: {
        label: "Total",
        color: "hsl(var(--accent))",
      },
    }

    // Memoize the events by their ID.
    const eventsById = useMemo(() => {
        return clubEvents.reduce((acc, event) => {
            acc[event.id] = event;
            return acc;
        }, {} as Record<string, Event>);
    }, [clubEvents]);

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={() => handleOpenExpenseForm(null)}><PlusCircle className="mr-2 h-4 w-4"/>Add Expense</Button>
            </div>

            <div className="space-y-8">
                 <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Budget Overview</CardTitle>
                        <CardDescription>Manage and track your club's monthly budget.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <label htmlFor="budget-input" className="text-sm font-medium">Set Monthly Budget</label>
                                <div className="flex gap-2">
                                  <Input 
                                      id="budget-input"
                                      ref={budgetInputRef}
                                      type="number"
                                      step="10"
                                      placeholder="e.g. 500"
                                      defaultValue={monthlyBudget > 0 ? monthlyBudget : ""}
                                      className="bg-transparent"
                                  />
                                  <Button onClick={handleBudgetUpdate}><Save className="mr-2" /> Save</Button>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-2 text-center p-4 rounded-lg bg-black/20">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Budget</p>
                                    <p className="text-2xl font-bold">{monthlyBudget.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Spent this month</p>
                                    <p className="text-2xl font-bold">{currentMonthSpending.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Remaining</p>
                                    <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-destructive' : ''}`}>{remainingBudget.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                         <div>
                            <Progress value={budgetProgress} className="h-3" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0%</span>
                                <span>{budgetProgress.toFixed(0)}% Used</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Expense History</CardTitle>
                        <CardDescription>A summary of your club's spending over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {expenses.length > 0 ? (
                             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip cursor={{fill: 'hsla(var(--muted), 0.3)'}} content={<ChartTooltipContent />} />
                                        <Bar dataKey="total" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">No expense data available to display chart.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="glassmorphism">
                    <CardHeader><CardTitle>All Expenses</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedExpenses.length > 0 ? (
                                        sortedExpenses.map((expense) => {
                                            const event = expense.eventId ? eventsById[expense.eventId] : null;
                                            return (
                                                <TableRow key={expense.id}>
                                                    <TableCell className="font-medium">{expense.name}</TableCell>
                                                    <TableCell>{expense.amount.toFixed(2)}</TableCell>
                                                    <TableCell>{format(new Date(expense.date), 'PP')}</TableCell>
                                                    <TableCell>
                                                        {event ? (
                                                             <Button variant="link" asChild className="p-0 h-auto">
                                                                <Link href={`/${club.slug}/${event.slug}`}>
                                                                    <Badge variant="outline">{event.title}</Badge>
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleOpenExpenseForm(expense)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => setDeletingExpenseId(expense.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">No expenses recorded yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ExpenseForm
                isOpen={isExpenseFormOpen}
                setIsOpen={setIsExpenseFormOpen}
                editingExpense={editingExpense}
                form={expenseForm}
                onSubmit={handleExpenseFormSubmit}
                clubEvents={clubEvents}
            />

            <AlertDialog open={!!deletingExpenseId} onOpenChange={() => setDeletingExpenseId(null)}>
                <AlertDialogContent className="glassmorphism">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this expense record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteExpense} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
