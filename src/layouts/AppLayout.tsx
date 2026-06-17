'use client';

import type { ReactNode } from 'react';
import AppNavigation from '../components/AppNavigation/AppNavigation';
import SelectedItemsFlyout from '../components/SelectedItemsFlyout/SelectedItemsFlyout.tsx';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle.tsx';
import '../App.css';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-container">
      <header className="app-header">
        <ThemeToggle />
        <AppNavigation />
      </header>
      {children}
      <SelectedItemsFlyout />
    </div>
  );
}
