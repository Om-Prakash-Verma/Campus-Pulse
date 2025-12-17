// Import the Link component from Next.js for client-side navigation.
import Link from "next/link";

/**
 * Renders the application footer.
 *
 * This component displays the footer section of the application, which includes
 * navigation links and a copyright notice.
 */
export function AppFooter() {
  return (
    // The footer element, styled with Tailwind CSS classes for width, padding, and margin.
    <footer className="w-full py-6 mt-12">
      {/* A container to center the footer content and set text styles. */}
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        {/* A flex container for the navigation links. */}
        <div className="flex justify-center gap-4 mb-2">
            {/* Link to the Home page. */}
            <Link href="/" className="hover:text-accent">Home</Link>
            {/* Link to the Clubs page. */}
            <Link href="/clubs" className="hover:text-accent">Clubs</Link>
            {/* Link to the Features page. */}
            <Link href="/features" className="hover:text-accent">Features</Link>
        </div>
        {/* The copyright notice, which dynamically displays the current year. */}
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </div>
    </footer>
  );
}
