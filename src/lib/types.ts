export type EventCategory = "Academic" | "Sports" | "Social" | "Tech" | "Music";

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type Event = {
  id: string;
  clubId: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  registrationLink: string;
  image: string;
  tags?: string[];
  gallery?: string[];
  reviews?: Review[];
};

export type Person = {
  id:string;
  name: string;
  role: 'Leader' | 'Member';
  email?: string;
  phone?: string;
  branch?: string;
  department?: string;
  avatar?: string;
};

export type Expense = {
  id: string;
  name: string;
  amount: number;
  date: string;
  eventId?: string;
};

export type ClubResource = {
  id: string;
  label: string;
  url: string;
}

export type Club = {
  id: string;
  slug: string;
  name: string;
  password: string;
  category: EventCategory;
  logo?: string;
  description?: string;
  leaders?: Person[];
  members?: Person[];
  expenses?: Expense[];
  monthlyBudget?: number;
  resources?: ClubResource[];
  themeColor?: string;
};
