'use client';

import { usePathname } from './i18n/navigation';
import App from './App';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

export default function AppRouter() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/details') {
    return <App />;
  }

  return <NotFoundPage />;
}
