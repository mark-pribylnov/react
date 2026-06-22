import { getTranslations } from 'next-intl/server';
import { localizeErrorMessage } from '../../lib/localizeErrorMessage';
import {
  getTotalPages,
  paginateResults,
} from '../../lib/searchParams';
import type { PokemonResult } from '../../types/pokemon';
import { ResultsPaginationClient } from './ResultsPaginationClient';
import { ResultsPanelRowClient } from './ResultsPanelRowClient';
import '../../components/ResultsPanel/ResultsPanel.scss';

type ResultsPanelServerProps = {
  results: PokemonResult[];
  currentPage: number;
  errorMessage: string;
  selectedDetailsIndex: number | null;
};

export async function ResultsPanelServer({
  results,
  currentPage,
  errorMessage,
  selectedDetailsIndex,
}: ResultsPanelServerProps) {
  const t = await getTranslations('resultsPanel');
  const tErrors = await getTranslations('errors');
  const localizedErrorMessage = localizeErrorMessage(errorMessage, tErrors);
  const pageResults = paginateResults(results, currentPage);
  const totalPages = getTotalPages(results.length);
  const showPagination = results.length > 0 && !localizedErrorMessage;
  const columnCount = 3;

  return (
    <section className="results-section">
      <header className="section-header">
        <h2>{t('heading')}</h2>
        {showPagination ? (
          <ResultsPaginationClient
            currentPage={currentPage}
            totalPages={totalPages}
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
          {localizedErrorMessage ? (
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
            pageResults.map((result) => {
              const itemIndex = results.indexOf(result) + 1;

              return (
                <ResultsPanelRowClient
                  key={`${result.name}-${itemIndex}`}
                  result={result}
                  itemIndex={itemIndex}
                  selectedDetailsIndex={selectedDetailsIndex}
                  imageAltLabel={t('imageAlt', { name: result.name })}
                  selectItemLabel={t('selectItem', { name: result.name })}
                />
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
