'use client';

import type { ChangeEvent, SubmitEvent } from 'react';
import { useTranslations } from 'next-intl';
import './SearchPanel.css';

export type SearchPanelProps = {
  searchQuery: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onRefresh: () => void;
  onSimulateError: () => void;
};

export function SearchPanel({
  searchQuery,
  onQueryChange,
  onSubmit,
  onRefresh,
  onSimulateError,
}: SearchPanelProps) {
  const t = useTranslations('searchPanel');

  return (
    <section className="search-section">
      <div className="search-section__left-side">
        <h2>{t('heading')}</h2>
        <div className="search-section__actions">
          <button
            type="button"
            className="refresh-button"
            onClick={onRefresh}
          >
            {t('refresh')}
          </button>
          <button
            type="button"
            className="simulate-error-button"
            onClick={onSimulateError}
          >
            {t('testError')}
          </button>
        </div>
        <form action="#" onSubmit={onSubmit}>
          <label htmlFor="search-terms-input">{t('searchTerms')}</label>
          <input
            id="search-terms-input"
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={onQueryChange}
          />
          <button type="submit" className="search-button">
            {t('search')}
          </button>
        </form>
      </div>
    </section>
  );
}
