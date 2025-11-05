# Campus Pulse: The Ultimate College Event Hub

**Campus Pulse** is a modern, dynamic web application designed to be the centralized platform for all events and club activities on a college campus. It provides a rich, interactive user interface for students to discover campus happenings and a powerful admin dashboard for club organizers to manage their events, profiles, teams, and budgets.

The application is built with a modern frontend stack and simulates a full-stack experience by using browser `localStorage` for data persistence. This ensures all data is synchronized across tabs and browser sessions for a single user, providing a seamless experience without a traditional backend.

---

## Key Features

### For Students & Visitors

- **Dynamic Event Discovery**: A central homepage to explore all campus events with instant filtering by category (Academic, Social, Sports, etc.), a powerful search bar, and date range filtering.
- **Interactive Calendar View**: Toggle between a traditional list of events and a full monthly calendar to visually track upcoming activities.
- **Detailed Event & Club Pages**: Each event and club has its own dedicated page.
  - **Event Pages**: Feature a banner image, detailed description, date, time, location, and a direct link for registration. Past events also showcase photo galleries.
  - **Club Pages**: Showcase the club's mission, team roster, public resources, and lists of upcoming and past events.
- **Ratings & Reviews**: After an event has concluded, users can submit a star rating and a written review, helping others gauge event quality.
- **Comprehensive Club Directory**: A searchable directory of all student organizations on campus.

### For Club Administrators

- **Secure Authentication**: A simple and secure login/registration system for club administrators.
- **Centralized Admin Dashboard**: A powerful, tabbed interface to manage all club-related information.
- **Full Event Management**: Create, edit, and delete events. Add descriptive tags (e.g., `#workshop`, `#python`) to improve discoverability.
- **Photo Gallery Management**: Upload and delete photos from the galleries of past events.
- **Profile & Team Customization**:
  - Update the club's description and public information.
  - Set a custom **theme color** to personalize the club's public page.
  - Manage a list of **public resource links** (e.g., social media, documents).
  - Add, edit, and remove team leaders and members, including their roles and contact details.
- **Financial Management**:
  - Set a monthly budget for the club.
  - Track expenses in real-time, with a progress bar showing budget usage.
  - View a 6-month history of spending with a visual bar chart.

---

## Tech Stack & Architecture

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **State Management**: A custom React Hook (`useData`) serves as a single source of truth, managing client-side data.
- **Data Persistence**: The application uses the browser's **`localStorage`** to persist all data. This simulates a backend for a single-user experience, making the application fully functional without needing a database. All data is managed and synced across browser tabs.

---

## Getting Started

The application is designed to run in a managed environment. The initial data for clubs and events is populated from `src/lib/events.ts` and then persisted in `localStorage`. From that point on, all changes are saved directly in the browser.

To explore the application:
1.  **Visit the homepage** to browse and filter events.
2.  **Navigate to `/clubs`** to see the directory of all clubs.
3.  **Go to `/admin`** to either log in as an existing club (passwords are the club category in lowercase) or register a new one.
