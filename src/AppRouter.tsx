'use client';

import { usePathname } from './i18n/navigation';
import SearchPageInteractive from './views/SearchResultsPage/SearchPageInteractive';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

export default function AppRouter() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/details') {
    return <SearchPageInteractive />;
  }

  return <NotFoundPage />;
}
