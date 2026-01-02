import type { Metadata } from 'next';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tournament Aggregator',
  description: 'Live gaming tournaments at your fingertips',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
