import { Outlet } from 'react-router';
import AppNavigation from '../components/AppNavigation/AppNavigation';
import SelectedItemsFlyout from '../components/SelectedItemsFlyout/SelectedItemsFlyout.tsx';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle.tsx';
import '../App.css';

export default function AppLayout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <ThemeToggle />
        <AppNavigation />
      </header>
      <Outlet />
      <SelectedItemsFlyout />
    </div>
  );
}
