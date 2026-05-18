import type { PokemonResult } from '../../types/pokemon';
import PageSwitcher from '../PageSwitcher/PageSwitcher';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import './ResultsPanel.scss';
import type { PageDirection } from '../../types/otherTypes';

export type ResultsPanelProps = {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  errorMessage: string;
  results: PokemonResult[];
  selectedDetailsIndex?: number | null;
  onSelectItem?: (itemIndex: number) => void;
  onPageSwitch?: (direction: 'prev' | 'next') => void;
};

const ITEMS_PER_PAGE = 10;

export default function ResultsPanel({
  currentPage,
  setCurrentPage,
  isLoading,
  errorMessage,
  results,
  selectedDetailsIndex = null,
  onSelectItem,
}: ResultsPanelProps) {
  const fullPagesNumber = Math.floor(results.length / ITEMS_PER_PAGE);
  const remainingItems = results.length - fullPagesNumber * ITEMS_PER_PAGE;
  const totalPages = remainingItems ? fullPagesNumber + 1 : fullPagesNumber;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const showedResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const showPagination = !isLoading && results.length > 0;

  function onPageSwitch(direction: PageDirection) {
    let delta = 0;

    if (direction === 'prev' && currentPage >= 2) delta = -1;
    if (direction === 'next' && totalPages > currentPage) delta = 1;

    setCurrentPage(currentPage + delta);
  }

  function getItemIndexInFullResults(item: PokemonResult) {
    return results.indexOf(item);
  }

  function handleRowClick(
    event: MouseEvent<HTMLTableRowElement>,
    itemIndex: number
  ): void {
    event.stopPropagation();
    onSelectItem?.(itemIndex);
  }

  return (
    <section className="results-section">
      <header className="section-header">
        <h2>Result area:</h2>
        {showPagination ? (
          <PageSwitcher
            currentPage={currentPage}
            totalPages={totalPages}
            onPageSwitch={onPageSwitch}
          />
        ) : null}
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
            showedResults.map((result) => {
              const itemIndex = getItemIndexInFullResults(result) + 1;
              const isSelected = selectedDetailsIndex === itemIndex;

              return (
              <tr
                key={`${result.name}-${result.stats.join('|')}`}
                className={isSelected ? 'results-row-selected' : undefined}
                onClick={(event) => handleRowClick(event, itemIndex)}
              >
                <td>{`${itemIndex}) ${result.name}`}</td>
                <td>
                  <ul>
                    {result.stats.map((stat) => (
                      <li key={stat}>{stat}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
