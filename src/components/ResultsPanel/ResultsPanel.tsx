import type { PokemonResult } from '../../types/pokemon';
import PageSwitcher from '../PageSwitcher/PageSwitcher';
import { useState } from 'react';
import './ResultsPanel.scss';
import type { PageDirection } from '../../types/otherTypes';

export type ResultsPanelProps = {
  isLoading: boolean;
  errorMessage: string;
  results: PokemonResult[];
  onPageSwitch?: (direction: 'prev' | 'next') => void;
};

const ITEMS_PER_PAGE = 10;

export default function ResultsPanel({
  isLoading,
  errorMessage,
  results,
}: ResultsPanelProps) {
  const showedResults = results.slice(0, ITEMS_PER_PAGE);
  const [currentPage] = useState(1);

  function onPageSwitch(direction: PageDirection) {
    console.log(direction);
  }

  return (
    <section className="results-section">
      <header className="section-header">
        <h2>Result area:</h2>
        <PageSwitcher currentPage={currentPage} onPageSwitch={onPageSwitch} />
      </header>

      <table className="results-table">
        <thead>
          <tr>
            <th scope="col">Pokemon Name</th>
            <th scope="col">Pokemon Stats</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="results-row-loading">
              <td colSpan={2}>
                <div className="loading-indicator" role="status">
                  <span className="loading-spinner" />
                  Loading results...
                </div>
              </td>
            </tr>
          ) : errorMessage ? (
            <tr className="results-row-error">
              <td colSpan={2} role="alert">
                {errorMessage}
              </td>
            </tr>
          ) : results.length === 0 ? (
            <tr>
              <td>Nothing to show yet</td>
              <td>Nothing to show yet</td>
            </tr>
          ) : (
            showedResults.map((result, index) => (
              <tr key={`${result.name}-${result.stats.join('|')}`}>
                <td>{`${index + 1}) ${result.name}`}</td>
                <td>
                  <ul>
                    {result.stats.map((stat) => (
                      <li key={stat}>{stat}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
