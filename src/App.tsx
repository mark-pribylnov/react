import React, { type ChangeEvent, type SubmitEvent } from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary/AppErrorBoundary';
import { ResultsPanel } from './components/ResultsPanel/ResultsPanel';
import { SearchPanel } from './components/SearchPanel/SearchPanel';
import { delay } from './lib/delay';
import { getErrorMessage } from './lib/httpError';
import { PokemonApi } from './services/pokemonApi';
import { getLastSearch, saveSearchTerm } from './storage/searchTermStorage';
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

class AppContent extends React.Component<Record<string, never>, AppState> {
  private readonly pokemonApi: PokemonApi;
  currentPage = 1;

  constructor(props: Record<string, never>) {
    super(props);
    this.pokemonApi = new PokemonApi();
    this.state = {
      searchQuery: getLastSearch(),
      results: [],
      lastExecutedSearch: null,
      isLoading: false,
      errorMessage: '',
      shouldSimulateCrash: false,
    };
  }

  private readonly onQueryChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({ searchQuery: event.target.value });
  };

  private readonly simulateAppError = (): void => {
    this.setState({ shouldSimulateCrash: true });
  };

  private readonly executeSearch = async (
    normalizedTerm: string
  ): Promise<void> => {
    this.setState({
      isLoading: true,
      errorMessage: '',
      searchQuery: normalizedTerm,
    });

    try {
      await delay(LOADING_DELAY_MS);
      const results = normalizedTerm
        ? await this.pokemonApi.fetchPokemonSearchResults(normalizedTerm)
        : await this.pokemonApi.fetchFirstPagePokemon();

      this.setState({
        results,
        lastExecutedSearch: normalizedTerm,
        errorMessage:
          normalizedTerm && results.length === 0
            ? 'No results found for this search.'
            : '',
      });
    } catch (error) {
      this.setState({
        results: [],
        lastExecutedSearch: normalizedTerm,
        errorMessage: getErrorMessage(error),
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private readonly loadInitialResults = async (): Promise<void> => {
    const term = this.state.searchQuery.trim();
    await this.executeSearch(term);
  };

  componentDidMount(): void {
    void this.loadInitialResults();
  }

  private readonly onSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const term = this.state.searchQuery.trim();
    if (term === this.state.lastExecutedSearch) {
      if (term !== this.state.searchQuery) {
        this.setState({ searchQuery: term });
      }
      return;
    }

    saveSearchTerm(term);
    await this.executeSearch(term);
  };

  render() {
    const {
      searchQuery,
      results,
      isLoading,
      errorMessage,
      shouldSimulateCrash,
    } = this.state;

    if (shouldSimulateCrash) {
      throw new Error('Test error button triggered application crash.');
    }

    return (
      <div className="app-container">
        <SearchPanel
          currentPage={this.currentPage}
          searchQuery={searchQuery}
          onQueryChange={this.onQueryChange}
          onSubmit={this.onSubmit}
          onSimulateError={this.simulateAppError}
        />
        <ResultsPanel
          isLoading={isLoading}
          errorMessage={errorMessage}
          results={results}
        />
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <AppErrorBoundary>
        <AppContent />
      </AppErrorBoundary>
    );
  }
}

export default App;
