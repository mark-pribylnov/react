import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { useMatch, useNavigate, useSearchParams } from 'react-router';
import { AppErrorBoundary } from './components/AppErrorBoundary/AppErrorBoundary';
import MasterDetailLayout from './components/MasterDetailLayout/MasterDetailLayout';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { SearchPanel } from './components/SearchPanel/SearchPanel';
import { delay } from './lib/delay';
import { getErrorMessage } from './lib/httpError';
import {
  buildListSearchParams,
  readDetailsIndexFromSearchParams,
  readPageFromSearchParams,
} from './lib/searchParams';
import { PokemonApi } from './services/pokemonApi';
import { useSearchTermStorage } from './hooks/useSearchTermStorage';
import type { HomeOutletContext } from './types/homeOutletContext';
import type { PokemonResult } from './types/pokemon';
import './App.css';

type AppState = {
  searchQuery: string;
  results: PokemonResult[];
  lastExecutedSearch: string | null;
  isLoading: boolean;
  errorMessage: string;
  shouldSimulateCrash: boolean;
};

const LOADING_DELAY_MS = 200;

function AppContent() {
  const pokemonApiRef = useRef<PokemonApi | null>(null);
  if (pokemonApiRef.current === null) {
    pokemonApiRef.current = new PokemonApi();
  }

  const { readSearchTerm, persistSearchTerm } = useSearchTermStorage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDetailsOpen = Boolean(useMatch({ path: '/details', end: true }));
  const currentPage = readPageFromSearchParams(searchParams);
  const selectedDetailsIndex = readDetailsIndexFromSearchParams(searchParams);

  const [state, setState] = useState<AppState>(() => ({
    searchQuery: readSearchTerm(),
    results: [],
    lastExecutedSearch: null,
    isLoading: false,
    errorMessage: '',
    shouldSimulateCrash: false,
  }));

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

  const fetchPokemonDetails = useCallback(async (name: string) => {
    const api = pokemonApiRef.current;
    if (!api) return null;
    return api.fetchOnePokemon(name);
  }, []);

  const outletContext = useMemo<HomeOutletContext>(
    () => ({
      results: state.results,
      fetchPokemonDetails,
      closeDetails: closeItemDetails,
    }),
    [closeItemDetails, fetchPokemonDetails, state.results]
  );

  const executeSearch = useCallback(async (normalizedTerm: string) => {
    const api = pokemonApiRef.current;
    if (!api) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      errorMessage: '',
      searchQuery: normalizedTerm,
    }));

    try {
      await delay(LOADING_DELAY_MS);
      const results = normalizedTerm
        ? await api.fetchPokemonSearchResults(normalizedTerm)
        : await api.fetchFirstPagePokemon();

      setState((prev) => ({
        ...prev,
        results,
        lastExecutedSearch: normalizedTerm,
        errorMessage:
          normalizedTerm && results.length === 0
            ? 'No results found for this search.'
            : '',
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        results: [],
        lastExecutedSearch: normalizedTerm,
        errorMessage: getErrorMessage(error),
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    void executeSearch(readSearchTerm().trim());
  }, [executeSearch, readSearchTerm]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState((prev) => ({ ...prev, searchQuery: event.target.value }));
  };

  const simulateAppError = (): void => {
    setState((prev) => ({ ...prev, shouldSimulateCrash: true }));
  };

  const onSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const term = state.searchQuery.trim();
    if (term === state.lastExecutedSearch) {
      if (term !== state.searchQuery) {
        setState((prev) => ({ ...prev, searchQuery: term }));
      }
      return;
    }

    persistSearchTerm(term);
    navigateWithListParams({ page: 1, detailsIndex: null, openDetails: false });
    await executeSearch(term);
  };

  const handleListPanelClick = (): void => {
    if (isDetailsOpen) {
      closeItemDetails();
    }
  };

  const { searchQuery, results, isLoading, errorMessage, shouldSimulateCrash } =
    state;

  if (shouldSimulateCrash) {
    throw new Error('Test error button triggered application crash.');
  }

  return (
    <>
      <SearchPanel
        searchQuery={searchQuery}
        onQueryChange={onQueryChange}
        onSubmit={onSubmit}
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
