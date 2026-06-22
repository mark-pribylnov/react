'use client';

import { usePathname } from '../i18n/navigation';
import AppRouter from '../AppRouter';
import { TestAboutPage } from './TestAboutPage';

export function TestAppContent() {
  const pathname = usePathname();

  if (pathname === '/about') {
    return <TestAboutPage />;
  }

  return <AppRouter />;
}
