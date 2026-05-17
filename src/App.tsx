import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary/AppErrorBoundary';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { SearchPanel } from './components/SearchPanel/SearchPanel';
import { delay } from './lib/delay';
import { getErrorMessage } from './lib/httpError';
import { PokemonApi } from './services/pokemonApi';
import { getLastSearch, saveSearchTerm } from './storage/searchTermStorage';
import type { PokemonResult } from './types/pokemon';
import { useSearchParams } from 'react-router';
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

function getPageFromUrl(params: URLSearchParams): number {
  const raw = params.get('page');
  const parsed = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

function AppContent() {
  const pokemonApiRef = useRef<PokemonApi | null>(null);
  if (pokemonApiRef.current === null) {
    pokemonApiRef.current = new PokemonApi();
  }

  const [state, setState] = useState<AppState>(() => ({
    searchQuery: getLastSearch(),
    results: [],
    lastExecutedSearch: null,
    isLoading: false,
    errorMessage: '',
    shouldSimulateCrash: false,
  }));

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getPageFromUrl(searchParams);

  const setCurrentPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const nextPage =
        typeof updater === 'function' ? updater(currentPage) : updater;

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextPage <= 1) {
          next.delete('page');
        } else {
          next.set('page', String(nextPage));
        }
        return next;
      });
    },
    [currentPage, setSearchParams]
  );

  const executeSearch = useCallback(
    async (normalizedTerm: string) => {
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
    },
    []
  );

  useEffect(() => {
    void executeSearch(getLastSearch().trim());
  }, [executeSearch]);

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

    saveSearchTerm(term);
    setCurrentPage(1);
    await executeSearch(term);
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
      <ResultsPanel
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
        errorMessage={errorMessage}
        results={results}
      />
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
