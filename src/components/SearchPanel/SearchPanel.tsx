import type { ChangeEvent, SubmitEvent } from 'react';
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
  return (
    <section className="search-section">
      <div className="search-section__left-side">
        <h2>Search area:</h2>
        <div className="search-section__actions">
          <button
            type="button"
            className="refresh-button"
            onClick={onRefresh}
          >
            Refresh
          </button>
          <button
            type="button"
            className="simulate-error-button"
            onClick={onSimulateError}
          >
            Test Error Boundary
          </button>
        </div>
        <form action="#" onSubmit={onSubmit}>
          <label htmlFor="search-terms-input">Search terms</label>
          <input
            id="search-terms-input"
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={onQueryChange}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
