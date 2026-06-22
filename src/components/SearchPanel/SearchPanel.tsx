'use client';

import type { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import './SearchPanel.css';

export type SearchPanelProps = {
  searchQuery: string;
  currentSearch: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  formAction: (formData: FormData) => void;
  onBeforeSubmit?: () => void;
  isSearchPending?: boolean;
  onRefresh: () => void;
  onSimulateError: () => void;
};

export function SearchPanel({
  searchQuery,
  currentSearch,
  onQueryChange,
  formAction,
  onBeforeSubmit,
  isSearchPending = false,
  onRefresh,
  onSimulateError,
}: SearchPanelProps) {
  const t = useTranslations('searchPanel');

  const handleSubmit = (): void => {
    onBeforeSubmit?.();
  };

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
        <form action={formAction} onSubmit={handleSubmit}>
          <input type="hidden" name="currentSearch" value={currentSearch} />
          <label htmlFor="search-terms-input">{t('searchTerms')}</label>
          <input
            id="search-terms-input"
            name="searchQuery"
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={onQueryChange}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isSearchPending}
          >
            {t('search')}
          </button>
        </form>
      </div>
    </section>
  );
}
