import { Outlet } from 'react-router';
import AppNavigation from '../components/AppNavigation/AppNavigation';
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
    </div>
  );
}
