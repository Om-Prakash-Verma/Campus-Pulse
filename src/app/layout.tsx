import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/header';
import { AppFooter } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Campus Pulse',
  description: 'Your one-stop destination for all college events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col relative">
        <AppHeader />
        <main className="flex-grow">{children}</main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
