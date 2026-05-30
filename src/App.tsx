import {
  useCallback,
  useEffect,
  useMemo,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { useMatch, useNavigate, useSearchParams } from 'react-router';
import { AppErrorBoundary } from './components/AppErrorBoundary/AppErrorBoundary';
import MasterDetailLayout from './components/MasterDetailLayout/MasterDetailLayout';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { SearchPanel } from './components/SearchPanel/SearchPanel';
import { usePokemonListQuery } from './hooks/usePokemonListQuery';
import { useSearchTermStorage } from './hooks/useSearchTermStorage';
import {
  buildListSearchParams,
  readDetailsIndexFromSearchParams,
  readPageFromSearchParams,
} from './lib/searchParams';
import {
  invalidateAllPokemonCache,
  normalizeSearchQuery,
  setLastExecutedSearch,
  setSearchQuery,
  setShouldSimulateCrash,
  useAppDispatch,
  useAppSelector,
} from './store';
import type { HomeOutletContext } from './types/homeOutletContext';
import './App.css';

function AppContent() {
  const dispatch = useAppDispatch();
  const { searchQuery, lastExecutedSearch, shouldSimulateCrash } =
    useAppSelector((state) => state.search);
  const { results, isLoading, errorMessage } =
    usePokemonListQuery(lastExecutedSearch);

  const { readSearchTerm, persistSearchTerm } = useSearchTermStorage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDetailsOpen = Boolean(useMatch({ path: '/details', end: true }));
  const currentPage = readPageFromSearchParams(searchParams);
  const selectedDetailsIndex = readDetailsIndexFromSearchParams(searchParams);

  const navigateWithListParams = useCallback(
    (options: {
      page: number;
      detailsIndex?: number | null;
      openDetails?: boolean;
    }) => {
      const search = buildListSearchParams({
        page: options.page,
        detailsIndex: options.openDetails
          ? (options.detailsIndex ?? null)
          : null,
      });
      const pathname = options.openDetails ? '/details' : '/';
      navigate({ pathname, search });
    },
    [navigate]
  );

  const setCurrentPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const nextPage =
        typeof updater === 'function' ? updater(currentPage) : updater;

      navigateWithListParams({
        page: nextPage,
        detailsIndex: selectedDetailsIndex,
        openDetails: isDetailsOpen,
      });
    },
    [currentPage, isDetailsOpen, navigateWithListParams, selectedDetailsIndex]
  );

  const openItemDetails = useCallback(
    (itemIndex: number) => {
      navigateWithListParams({
        page: currentPage,
        detailsIndex: itemIndex,
        openDetails: true,
      });
    },
    [currentPage, navigateWithListParams]
  );

  const closeItemDetails = useCallback(() => {
    navigateWithListParams({
      page: currentPage,
      detailsIndex: null,
      openDetails: false,
    });
  }, [currentPage, navigateWithListParams]);

  const outletContext = useMemo<HomeOutletContext>(
    () => ({
      results,
      closeDetails: closeItemDetails,
    }),
    [closeItemDetails, results]
  );

  useEffect(() => {
    const term = readSearchTerm().trim();
    dispatch(setSearchQuery(term));
    dispatch(setLastExecutedSearch(term));
  }, [dispatch, readSearchTerm]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSearchQuery(event.target.value));
  };

  const simulateAppError = (): void => {
    dispatch(setShouldSimulateCrash(true));
  };

  const handleRefresh = (): void => {
    invalidateAllPokemonCache(dispatch);
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const term = searchQuery.trim();
    if (term === lastExecutedSearch) {
      if (term !== searchQuery) {
        dispatch(normalizeSearchQuery());
      }
      return;
    }

    persistSearchTerm(term);
    navigateWithListParams({ page: 1, detailsIndex: null, openDetails: false });
    dispatch(setLastExecutedSearch(term));
  };

  const handleListPanelClick = (): void => {
    if (isDetailsOpen) {
      closeItemDetails();
    }
  };

  if (shouldSimulateCrash) {
    throw new Error('Test error button triggered application crash.');
  }

  return (
    <>
      <SearchPanel
        searchQuery={searchQuery}
        onQueryChange={onQueryChange}
        onSubmit={onSubmit}
        onRefresh={handleRefresh}
        onSimulateError={simulateAppError}
      />
      <MasterDetailLayout
        onListPanelClick={handleListPanelClick}
        outletContext={outletContext}
      >
        <ResultsPanel
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          errorMessage={errorMessage}
          results={results}
          selectedDetailsIndex={selectedDetailsIndex}
          onSelectItem={openItemDetails}
        />
      </MasterDetailLayout>
    </>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}

export default App;
