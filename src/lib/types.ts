// Defines the possible categories for an event.
export type EventCategory = "Academic" | "Sports" | "Social" | "Tech" | "Music";

// Represents a review for an event.
export type Review = {
  id: string; // Unique identifier for the review.
  author: string; // Name of the person who wrote the review.
  rating: number; // Rating given by the author, typically on a scale of 1-5.
  comment: string; // The review comment.
  date: string; // The date the review was posted.
}

// Represents an event organized by a club.
export type Event = {
  id: string; // Unique identifier for the event.
  clubId: string; // The ID of the club that organized the event.
  slug: string; // URL-friendly version of the event title.
  title: string; // The title of the event.
  description: string; // A detailed description of the event.
  date: string; // The date and time of the event.
  location: string; // The venue or location of the event.
  category: EventCategory; // The category of the event.
  registrationLink: string; // Link to the event's registration page.
  image: string; // URL of the event's promotional image.
  tags?: string[]; // Optional tags for filtering and searching events.
  gallery?: string[]; // Optional list of image URLs for the event gallery.
  reviews?: Review[]; // Optional list of reviews for the event.
};

// Represents a person associated with a club, such as a leader or member.
export type Person = {
  id:string; // Unique identifier for the person.
  name: string; // The person's full name.
  role: 'Leader' | 'Member'; // The person's role in the club.
  email?: string; // The person's email address.
  phone?: string; // The person's phone number.
  branch?: string; // The person's academic branch or major.
  department?: string; // The person's department.
  avatar?: string; // URL of the person's profile picture.
};

// Represents a financial expense related to a club or event.
export type Expense = {
  id: string; // Unique identifier for the expense.
  name: string; // A brief description of the expense.
  amount: number; // The amount of the expense.
  date: string; // The date the expense was incurred.
  eventId?: string; // Optional ID of the event this expense is associated with.
};

// Represents a resource for a club, such as a link to a social media page or a document.
export type ClubResource = {
  id: string; // Unique identifier for the resource.
  label: string; // The display text for the resource link.
  url: string; // The URL of the resource.
}

// Represents a student club.
export type Club = {
  id: string; // Unique identifier for the club.
  slug: string; // URL-friendly version of the club name.
  name: string; // The name of the club.
  password: string; // Password for accessing club-specific features.
  category: EventCategory; // The primary category of the club.
  logo?: string; // URL of the club's logo.
  description?: string; // A brief description of the club.
  leaders?: Person[]; // A list of the club's leaders.
  members?: Person[]; // A list of the club's members.
  expenses?: Expense[]; // A list of the club's expenses.
  monthlyBudget?: number; // The club's monthly budget.
  resources?: ClubResource[]; // A list of resources for the club.
  themeColor?: string; // A hex color code for branding the club's page.
};
