'use client';

import { useTranslations } from 'next-intl';

type ErrorBoundaryFallbackProps = {
  onReset: () => void;
};

export function ErrorBoundaryFallback({ onReset }: ErrorBoundaryFallbackProps) {
  const t = useTranslations('errorBoundary');

  return (
    <div className="app-container">
      <section className="error-boundary-fallback">
        <h2>{t('heading')}</h2>
        <p>{t('message')}</p>
        <button className="search-button" type="button" onClick={onReset}>
          {t('reset')}
        </button>
      </section>
    </div>
  );
}
