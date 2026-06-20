'use client';

import { Link, usePathname } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';
import './AppNavigation.scss';

function getNavLinkClassName(isActive: boolean): string {
  return isActive
    ? 'app-navigation__link app-navigation__link--active'
    : 'app-navigation__link';
}

export default function AppNavigation() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav className="app-navigation" aria-label={t('ariaLabel')}>
      <Link href="/" className={getNavLinkClassName(pathname === '/')}>
        {t('search')}
      </Link>
      <Link href="/about" className={getNavLinkClassName(pathname === '/about')}>
        {t('about')}
      </Link>
    </nav>
  );
}
