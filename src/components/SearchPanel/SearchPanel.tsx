import React, { type ChangeEvent, type SubmitEvent } from 'react';
import './SearchPanel.css';

export type SearchPanelProps = {
  searchQuery: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onSimulateError: () => void;
};

export class SearchPanel extends React.Component<SearchPanelProps> {
  render() {
    const { searchQuery, onQueryChange, onSubmit, onSimulateError } =
      this.props;

    return (
      <section className="search-section">
        <div className="search-section__left-side">
          <h2>Search area:</h2>
          <button
            type="button"
            className="simulate-error-button"
            onClick={onSimulateError}
          >
            Test Error Boundary
          </button>
          <form action="#" onSubmit={onSubmit}>
            <input
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
}
