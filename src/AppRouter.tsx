'use client';

import { usePathname } from 'next/navigation';
import App from './App';
import AppLayout from './layouts/AppLayout';
import AboutPage from './views/AboutPage/AboutPage';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

export default function AppRouter() {
  const pathname = usePathname();

  if (pathname === '/about') {
    return (
      <AppLayout>
        <AboutPage />
      </AppLayout>
    );
  }

  if (pathname === '/' || pathname === '/details') {
    return (
      <AppLayout>
        <App />
      </AppLayout>
    );
  }

  return <NotFoundPage />;
}
