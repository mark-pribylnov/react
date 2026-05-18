import { NavLink } from 'react-router';
import './AppNavigation.scss';

function getNavLinkClassName({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'app-navigation__link app-navigation__link--active'
    : 'app-navigation__link';
}

export default function AppNavigation() {
  return (
    <nav className="app-navigation" aria-label="Main navigation">
      <NavLink to="/" end className={getNavLinkClassName}>
        Search
      </NavLink>
      <NavLink to="/about" className={getNavLinkClassName}>
        About
      </NavLink>
    </nav>
  );
}
