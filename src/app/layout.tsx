// Import the 'Metadata' type from Next.js for setting page metadata.
import type { Metadata } from 'next';
// Import global CSS styles for the application.
import './globals.css';
// Import the 'Toaster' component for displaying notifications.
import { Toaster } from '@/components/ui/toaster';
// Import the main header component for the application.
import { AppHeader } from '@/components/header';
// Import the main footer component for the application.
import { AppFooter } from '@/components/footer';

// Define metadata for the application, such as the title and description.
export const metadata: Metadata = {
  title: 'Campus Pulse',
  description: 'Your one-stop destination for all college events.',
};

/**
 * The root layout component for the entire application.
 * This component wraps all pages and provides a consistent structure.
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root layout element.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set the language of the page to English and apply a dark theme.
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts for performance optimization. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Import the 'Inter' font from Google Fonts with specified weights. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Apply body styles for font, anti-aliasing, and a flex-based layout. */}
      <body className="font-body antialiased min-h-screen flex flex-col relative">
        {/* Render the application header. */}
        <AppHeader />
        {/* The main content area where page-specific components are rendered. */}
        <main className="flex-grow">{children}</main>
        {/* Render the application footer. */}
        <AppFooter />
        {/* Render the toaster component for displaying notifications. */}
        <Toaster />
      </body>
    </html>
  );
}
