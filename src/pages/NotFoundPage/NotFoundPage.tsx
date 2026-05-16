import { Link } from 'react-router';
import '../../App.css';
import './NotFoundPage.scss';

export default function NotFoundPage() {
  return (
    <div className="app-container">
      <section className="not-found-page">
        <h1 className="not-found-page__code">404</h1>
        <h2 className="not-found-page__title">Page not found</h2>
        <p className="not-found-page__message">
          The page you are looking for does not exist
        </p>
        <Link to="/" className="not-found-page__link">
          Back to main app
        </Link>
      </section>
    </div>
  );
}
