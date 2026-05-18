import { Outlet } from 'react-router';
import AppNavigation from '../components/AppNavigation/AppNavigation';
import '../App.css';

export default function AppLayout() {
  return (
    <div className="app-container">
      <AppNavigation />
      <Outlet />
    </div>
  );
}
