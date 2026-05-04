import React from 'react';
import type { PokemonResult } from '../types/pokemon';

export type ResultsPanelProps = {
  isLoading: boolean;
  errorMessage: string;
  results: PokemonResult[];
};

export class ResultsPanel extends React.Component<ResultsPanelProps> {
  render() {
    const { isLoading, errorMessage, results } = this.props;

    return (
      <section className="results-section">
        <h2>Result area:</h2>
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
                  <div
                    className="loading-indicator"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="loading-spinner" aria-hidden="true" />
                    Loading results...
                  </div>
                </td>
              </tr>
            ) : errorMessage ? (
              <tr className="results-row-error">
                <td colSpan={2} role="alert" aria-live="assertive">
                  {errorMessage}
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td>Nothing to show yet</td>
                <td>Nothing to show yet</td>
              </tr>
            ) : (
              results.map((result) => (
                <tr key={`${result.name}-${result.stats.join('|')}`}>
                  <td>{result.name}</td>
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
}
