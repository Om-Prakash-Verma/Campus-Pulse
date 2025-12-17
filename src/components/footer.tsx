import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="w-full py-6 mt-12">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4 mb-2">
            <Link href="/" className="hover:text-accent">Home</Link>
            <Link href="/clubs" className="hover:text-accent">Clubs</Link>
            <Link href="/features" className="hover:text-accent">Features</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </div>
    </footer>
  );
}
