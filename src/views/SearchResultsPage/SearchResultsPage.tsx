import { fetchPokemonListForPage } from '../../lib/pokemonServerApi';
import { parseSearchPageParams } from '../../lib/searchPageParams';
import { ItemDetailsPanelShell } from './ItemDetailsPanelShell';
import { MasterDetailLayoutServer } from './MasterDetailLayoutServer';
import { ResultsPanelServer } from './ResultsPanelServer';
import { SearchPageClient } from './SearchPageClient';
import { AppErrorBoundary } from '../../components/AppErrorBoundary/AppErrorBoundary';
import '../../App.css';

type SearchResultsPageProps = {
  isDetailsOpen: boolean;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function SearchResultsPage({
  isDetailsOpen,
  searchParams,
}: SearchResultsPageProps) {
  const { currentPage, detailsIndex, searchTerm } =
    parseSearchPageParams(searchParams);
  const { results, errorMessage } = await fetchPokemonListForPage(searchTerm);

  return (
    <AppErrorBoundary>
      <SearchPageClient initialSearchTerm={searchTerm} />
      <MasterDetailLayoutServer
        isDetailsOpen={isDetailsOpen}
        detailsPanel={
          <ItemDetailsPanelShell
            results={results}
            detailsIndex={detailsIndex}
          />
        }
      >
        <ResultsPanelServer
          results={results}
          currentPage={currentPage}
          errorMessage={errorMessage}
          selectedDetailsIndex={detailsIndex}
        />
      </MasterDetailLayoutServer>
    </AppErrorBoundary>
  );
}
