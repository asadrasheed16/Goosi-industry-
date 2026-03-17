// app/layout.tsx
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import AuthProvider from '@/components/shared/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Goosi Industry — Premium Sports Equipment',
    template: '%s | Goosi Industry',
  },
  description:
    'Pakistan\'s leading sports equipment manufacturer and exporter. Premium cricket, football, boxing, and fitness gear for retail and B2B bulk orders.',
  keywords: ['sports equipment', 'cricket bat', 'football', 'boxing gloves', 'Pakistan exporter', 'Goosi Industry'],
  openGraph: {
    title: 'Goosi Industry — Premium Sports Equipment',
    description: 'Premium sports equipment manufacturer and global exporter from Pakistan.',
    url: 'https://goosi-industry.com',
    siteName: 'Goosi Industry',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Goosi Industry', description: 'Premium Sports Equipment' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-white text-gray-900 antialiased">
        <AuthProvider>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1e293b', color: '#f8fafc', borderRadius: '12px', padding: '12px 16px' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
