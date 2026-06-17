'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './AppNavigation.scss';

function getNavLinkClassName(isActive: boolean): string {
  return isActive
    ? 'app-navigation__link app-navigation__link--active'
    : 'app-navigation__link';
}

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="app-navigation" aria-label="Main navigation">
      <Link href="/" className={getNavLinkClassName(pathname === '/')}>
        Search
      </Link>
      <Link href="/about" className={getNavLinkClassName(pathname === '/about')}>
        About
      </Link>
    </nav>
  );
}
