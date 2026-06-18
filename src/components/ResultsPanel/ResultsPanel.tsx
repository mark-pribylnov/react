import type { PokemonResult } from '../../types/pokemon';
import PageSwitcher from '../PageSwitcher/PageSwitcher';
import type { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';
import './ResultsPanel.scss';
import type { PageDirection } from '../../types/otherTypes';
import { getPokemonItemKey } from '../../lib/pokemonItemKey';
import { useLocalizedErrorMessage } from '../../hooks/useLocalizedErrorMessage';
import { toggleSelectedItem, useAppDispatch, useAppSelector } from '../../store';

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
  const t = useTranslations('resultsPanel');
  const localizedErrorMessage = useLocalizedErrorMessage(errorMessage);
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const selectedKeys = new Set(
    selectedItems.map((item) => getPokemonItemKey(item.pokemon))
  );

  const fullPagesNumber = Math.floor(results.length / ITEMS_PER_PAGE);
  const remainingItems = results.length - fullPagesNumber * ITEMS_PER_PAGE;
  const totalPages = remainingItems ? fullPagesNumber + 1 : fullPagesNumber;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const showedResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const showPagination = !isLoading && results.length > 0;
  const columnCount = 3;

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

  function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    item: PokemonResult,
    listIndex: number
  ): void {
    event.stopPropagation();
    dispatch(toggleSelectedItem({ pokemon: item, listIndex }));
  }

  return (
    <section className="results-section">
      <header className="section-header">
        <h2>{t('heading')}</h2>
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
            <th scope="col" className="results-table__select-col">
              {t('select')}
            </th>
            <th scope="col">{t('pokemonName')}</th>
            <th scope="col">{t('pokemonStats')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="results-row-loading">
              <td colSpan={columnCount}>
                <div className="loading-indicator" role="status">
                  <span className="loading-spinner" />
                  {t('loading')}
                </div>
              </td>
            </tr>
          ) : localizedErrorMessage ? (
            <tr className="results-row-error">
              <td colSpan={columnCount} role="alert">
                {localizedErrorMessage}
              </td>
            </tr>
          ) : results.length === 0 ? (
            <tr>
              <td colSpan={columnCount}>{t('empty')}</td>
            </tr>
          ) : (
            showedResults.map((result) => {
              const itemIndex = getItemIndexInFullResults(result) + 1;
              const itemKey = getPokemonItemKey(result);
              const isChecked = selectedKeys.has(itemKey);
              const isDetailsOpen = selectedDetailsIndex === itemIndex;
              const rowClassName = [
                isChecked ? 'results-row-checked' : '',
                isDetailsOpen ? 'results-row-details-open' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <tr
                  key={itemKey}
                  className={rowClassName || undefined}
                  onClick={(event) => handleRowClick(event, itemIndex)}
                >
                  <td className="results-table__select-cell">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      aria-label={t('selectItem', { name: result.name })}
                      onChange={(event) =>
                        handleCheckboxChange(event, result, itemIndex)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  </td>
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
