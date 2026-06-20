'use client';

import { usePathname } from './i18n/navigation';
import App from './App';
import AboutPage from './views/AboutPage/AboutPage';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

export default function AppRouter() {
  const pathname = usePathname();

  if (pathname === '/about') {
    return <AboutPage />;
  }

  if (pathname === '/' || pathname === '/details') {
    return <App />;
  }

  return <NotFoundPage />;
}
