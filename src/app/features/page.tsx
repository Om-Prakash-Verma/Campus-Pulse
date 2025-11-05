
import { CheckCircle, BookOpen, Target, Rss, Layers, ThumbsDown, DraftingCompass, Scale, Calendar, Filter, PieChart, Star, Image as ImageIcon, Tag, Palette, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <li className="flex items-start gap-4">
    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </li>
);

const ProjectDetailItem = ({ icon, title, children }: { icon: React.ReactNode, title: string; children: React.ReactNode }) => (
    <AccordionItem value={title}>
        <AccordionTrigger className="text-xl font-semibold">
            <div className="flex items-center gap-3">
                {icon}
                {title}
            </div>
        </AccordionTrigger>
        <AccordionContent className="prose prose-invert max-w-none text-foreground/90 p-4">
            {children}
        </AccordionContent>
    </AccordionItem>
)

export default function FeaturesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Project Features
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          A comprehensive overview of the Campus Pulse application.
        </p>
      </header>

      <div className="space-y-12">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Core Functionality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
             <Card className='bg-background/40'>
                <CardHeader>
                    <CardTitle className='text-lg'>For Students & Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                    <FeatureItem
                        title="Dynamic Event Discovery"
                        description="The homepage provides a central hub to discover all campus happenings. Events can be instantly filtered by category, found via a powerful search bar that includes tags, or browsed visually."
                    />
                    <FeatureItem
                        title="Interactive Calendar View"
                        description="Toggle between a traditional list and a full monthly calendar view. Days with events are marked, and clicking a date shows all activities for that day."
                    />
                    <FeatureItem
                        title="Date Range Filtering"
                        description="Easily find events within a specific timeframe using 'from' and 'to' date pickers, allowing users to plan their schedule weeks or months in advance."
                    />
                    <FeatureItem
                        title="Event Ratings & Reviews"
                        description="After an event has passed, users can submit a star rating and a written review, helping others gauge event quality and providing valuable feedback to organizers."
                    />
                    <FeatureItem
                        title="Detailed Event Pages"
                        description="Every event has its own dedicated page with a banner image, description, date, time, location, and a direct link to register. Past events also feature photo galleries."
                    />
                    <FeatureItem
                        title="Comprehensive Club Directory"
                        description="A dedicated '/clubs' page lists all student organizations. Users can search for clubs to find their community."
                    />
                    <FeatureItem
                        title="In-Depth Club Profiles"
                        description="Each club has a public-facing page showcasing their mission, upcoming and past events, team roster, and a list of shared resources."
                    />
                    </ul>
                </CardContent>
            </Card>

            <Card className='bg-background/40'>
                <CardHeader>
                    <CardTitle className='text-lg'>For Club Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                    <FeatureItem
                        title="Secure Club Authentication"
                        description="Clubs can register for a new account or log in to their existing dashboard using a simple, password-protected system."
                    />
                    <FeatureItem
                        title="Centralized Admin Dashboard"
                        description="A powerful, tabbed interface that provides a single place for clubs to manage all their information and activities."
                    />
                    <FeatureItem
                        title="Advanced Event Management"
                        description="Admins can create, edit, and delete events. They can also add descriptive tags (e.g., #python, #fundraiser) to improve discoverability."
                    />
                    <FeatureItem
                        title="Past Event Photo Galleries"
                        description="For events that have already occurred, admins can upload a gallery of photos, creating a visual record of their activities and showcasing their club's culture."
                    />
                    <FeatureItem
                        title="Club Profile Customization"
                        description="Admins can update their club's description, set a custom theme color for their page, and manage a list of public resource links (e.g., social media, documents)."
                    />
                    <FeatureItem
                        title="Team Roster Management"
                        description="Admins can add, edit, or remove leaders and members from their club. This includes uploading avatars and providing contact details."
                    />
                    <FeatureItem
                        title="Budget Management & Tracking"
                        description="Admins can set a monthly budget for their club and track spending in real-time. A progress bar shows how much of the budget has been used."
                    />
                    </ul>
                </CardContent>
            </Card>

            <Card className='bg-background/40'>
                <CardHeader>
                    <CardTitle className='text-lg'>Technical & Architectural</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        <FeatureItem 
                            title="Component-Based Architecture"
                            description="Built with React and Next.js, the application is broken down into reusable components with a clean, organized, and maintainable file structure."
                        />
                        <FeatureItem 
                            title="Robust Client-Side State Management"
                            description="The app uses a custom React hook (`useData`) as a single source of truth, ensuring all data is perfectly synchronized across all components and browser tabs in real-time, using localStorage for persistence."
                        />

                        <FeatureItem
                            title="Modern UI/UX"
                            description="Styled with Tailwind CSS and ShadCN UI components, featuring a consistent dark theme, glassmorphism effects, and responsive design for all screen sizes."
                        />
                    </ul>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-6">
                <CardTitle className="text-3xl">Project Analysis</CardTitle>
            </CardHeader>
            <Accordion type="single" collapsible className="w-full">
                <ProjectDetailItem icon={<BookOpen />} title="Abstract">
                     <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Campus Pulse</strong> is a web application designed to serve as a <strong className="text-accent">centralized platform for college events</strong>.</li>
                        <li>It provides a dynamic UI for students to discover campus activities and for clubs to manage them, featuring event listings with robust search, filtering, and community feedback via ratings and reviews.</li>
                        <li>Includes a <strong className="text-accent">comprehensive admin dashboard</strong> with tools for event, member, finance, and profile management.</li>
                        <li>Built on a modern tech stack, it uses `localStorage` for client-side persistence, <strong className="text-accent">simulating a full-stack experience</strong> without a dedicated backend.</li>
                    </ul>
                </ProjectDetailItem>
                <ProjectDetailItem icon={<Target />} title="Objective">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Develop a <strong className="text-accent">single source of information</strong> for all college events to reduce fragmentation.</li>
                        <li>Provide club administrators with <strong className="text-accent">simple yet powerful tools</strong> to manage their events, profiles, team members, and finances.</li>
                        <li>Create an <strong className="text-accent">intuitive and visually appealing user experience</strong> that encourages student engagement through interactive features.</li>
                        <li>Build a <strong className="text-accent">scalable and maintainable codebase</strong> using modern web development practices and a component-based architecture.</li>
                    </ul>
                </ProjectDetailItem>
                <ProjectDetailItem icon={<Scale />} title="Scope of the Problem Statement">
                    <p>The core problem is the <strong className="text-accent">lack of a unified, easy-to-use platform</strong> for college event information, which is often scattered across various channels. Campus Pulse addresses this by:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Listing all upcoming college events from various clubs and departments.</li>
                        <li>Providing clear event details: descriptions, dates, locations, and banner images.</li>
                        <li>Serving as a central hub by linking to external registration pages.</li>
                        <li><strong className="text-accent">Empowering student clubs</strong> to digitally manage their own presence and announcements.</li>
                    </ul>
                </ProjectDetailItem>
                <ProjectDetailItem icon={<Rss />} title="Related Work">
                     <ul className="list-disc pl-5 space-y-2">
                        <li><strong>University Portals:</strong> Often <strong className="text-accent">outdated and difficult to navigate</strong>, lacking a modern, rich user experience.</li>
                        <li><strong>Social Media Groups:</strong> Lead to <strong className="text-accent">information silos</strong> where events are not easily searchable or filterable, requiring users to join multiple groups.</li>
                        <li><strong>Generic Event Platforms (e.g., Eventbrite):</strong> Powerful but <strong className="text-accent">not tailored to the specific context</strong> of a college campus, lacking integrated club directories and a campus-centric feel.</li>
                    </ul>
                </ProjectDetailItem>
                 <ProjectDetailItem icon={<Layers />} title="New Features">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong className="text-accent"><Tag className="inline-block mr-2" /> Advanced Tagging:</strong> Admins can add descriptive tags to events for more granular search and discovery.</li>
                        <li><strong className="text-accent"><Star className="inline-block mr-2" /> Ratings and Reviews:</strong> A feedback system for past events, allowing attendees to share their experience.</li>
                        <li><strong className="text-accent"><ImageIcon className="inline-block mr-2" /> Photo Galleries:</strong> Club admins can upload photos to past events, creating a visual history.</li>
                        <li><strong className="text-accent"><Filter className="inline-block mr-2" /> Date Range Filtering:</strong> Users can filter events on the homepage within a specific start and end date.</li>
                        <li><strong className="text-accent"><Calendar className="inline-block mr-2" /> Interactive Calendar View:</strong> A monthly calendar provides a visual overview of all scheduled events.</li>
                        <li><strong className="text-accent"><PieChart className="inline-block mr-2" /> Budgeting Tools:</strong> A financial tracker helps clubs set and manage their monthly budget.</li>
                        <li><strong className="text-accent"><Palette className="inline-block mr-2" /> Club Page Theming:</strong> Admins can choose a custom accent color to personalize their club's public page.</li>
                        <li><strong className="text-accent"><LinkIcon className="inline-block mr-2" /> Resource Sharing:</strong> Clubs can add a list of useful links (e.g., to their website, documents, or social media) to their profile.</li>
                    </ul>
                </ProjectDetailItem>
                <ProjectDetailItem icon={<ThumbsDown />} title="Limitations of the Project">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>No On-Platform Registration:</strong> The app links to external registration forms but <strong className="text-accent">does not handle registration itself</strong>.</li>
                        <li><strong>No Student Accounts:</strong> There is <strong className="text-accent">no functionality for individual students</strong> to create accounts, save favorites, or receive personalized recommendations.</li>
                        <li><strong>No Direct Communication Tools:</strong> The platform <strong className="text-accent">lacks built-in features for real-time chat</strong> or messaging.</li>
                        <li><strong>Single-Campus Focus:</strong> The design is centered around a single institution and does not support a <strong className="text-accent">multi-campus architecture</strong>.</li>
                    </ul>
                </ProjectDetailItem>
                <ProjectDetailItem icon={<DraftingCompass />} title="Conclusion and Future Scope">
                    <p>Campus Pulse successfully demonstrates a proof-of-concept for a modern, centralized college event platform. It achieves its objective of providing a feature-rich, user-friendly interface. The recent additions of community-focused features like reviews, galleries, and profile customization have made the platform more dynamic and engaging. While its reliance on `localStorage` is a limitation, it serves as an <strong className="text-accent">excellent foundation for a full-stack application</strong>.</p>
                    <p className="mt-2"><strong className="text-accent">Future enhancements should prioritize a full backend migration:</strong></p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Full Backend Integration:</strong> The most critical next step. Replace `localStorage` with a real database (like Firebase Firestore) and server-side API to enable multi-user, real-time functionality.</li>
                        <li><strong>Real Authentication:</strong> Integrate a secure provider (like Firebase Authentication) for proper student and admin accounts.</li>
                        <li><strong>Notification System:</strong> Add push notifications or email alerts for event reminders and new announcements.</li>
                        <li><strong>Interactive Campus Map:</strong> Integrate a map to show event locations visually.</li>
                        <li><strong>Mobile Application:</strong> Develop native apps for iOS and Android for on-the-go access.</li>
                    </ul>
                </ProjectDetailItem>
                <ProjectDetailItem icon={<BookOpen />} title="References">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Next.js:</strong> The React framework for production. (https://nextjs.org/)</li>
                        <li><strong>React:</strong> The library for web and native user interfaces. (https://react.dev/)</li>
                        <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid UI development. (https://tailwindcss.com/)</li>
                        <li><strong>ShadCN UI:</strong> A collection of re-usable UI components. (https://ui.shadcn.com/)</li>
                        <li><strong>Lucide React:</strong> A library of simply beautiful open-source icons. (https://lucide.dev/)</li>
                    </ul>
                </ProjectDetailItem>
            </Accordion>
        </Card>
      </div>
    </div>
  );
}
