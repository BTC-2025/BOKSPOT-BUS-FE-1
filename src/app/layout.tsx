import type { Metadata } from 'next';
import { ThemeManager } from './(dashboard)/ThemeManager';
import './globals.css';

export const metadata: Metadata = {
  title: 'BOKSPOT BUSINESS',
  description: 'Manage your services, bookings, and analytics on BOKSPOT Business Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
