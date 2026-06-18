'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import '../../App.css';
import './NotFoundPage.scss';

export default function NotFoundPage() {
  const t = useTranslations('notFoundPage');

  return (
    <div className="app-container">
      <section className="not-found-page">
        <h1 className="not-found-page__code">404</h1>
        <h2 className="not-found-page__title">{t('title')}</h2>
        <p className="not-found-page__message">{t('message')}</p>
        <Link href="/" className="not-found-page__link">
          {t('backHome')}
        </Link>
      </section>
    </div>
  );
}
