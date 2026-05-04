import React, { type ChangeEvent, type SubmitEvent } from 'react';
import './App.css';

type PokemonStat = {
  base_stat: number;
  stat: { name: string };
};

type PokemonResponse = {
  name: string;
  stats: PokemonStat[];
};

type PokemonListItem = {
  name: string;
};

type PokemonListResponse = {
  results: PokemonListItem[];
};

type PokemonResult = {
  name: string;
  stats: string[];
};

type AppState = {
  searchQuery: string;
  results: PokemonResult[];
  lastExecutedSearch: string | null;
  isLoading: boolean;
  errorMessage: string;
  shouldSimulateCrash: boolean;
};

const LOCAL_STORAGE_PROPERTIES = Object.freeze({
  searchTerm: 'searchTerm',
});
const FIRST_PAGE_LIMIT = 10;

class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

function readSavedSearchTerm(): string {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES.searchTerm);
    if (!raw) return '';

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const strings = parsed.filter((v): v is string => typeof v === 'string');
      return strings.at(-1) ?? '';
    }
    return typeof parsed === 'string' ? parsed : raw;
  } catch {
    return '';
  }
}

function saveSearchTerm(term: string): void {
  localStorage.setItem(LOCAL_STORAGE_PROPERTIES.searchTerm, term);
}

function getLastSearch(): string {
  return readSavedSearchTerm();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getHttpErrorMessage(status: number): string {
  if (status === 404) {
    return 'No results found for this search.';
  }
  if (status >= 500) {
    return 'Server error. Please try again in a moment.';
  }
  if (status >= 400) {
    return 'Request error. Please check your search and try again.';
  }
  return 'Could not load data. Please try again.';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }
  if (error instanceof Error) {
    return 'Network error. Please check your connection and try again.';
  }
  return 'Could not load data. Please try again.';
}

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class AppErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application error boundary caught an error:', error, info);
  }

  private readonly resetBoundary = (): void => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container">
          <section className="error-boundary-fallback">
            <h2>Something went wrong</h2>
            <p>
              The app hit an unexpected error. You can try resetting it and
              continue using the app.
            </p>
            <button className="search-button" onClick={this.resetBoundary}>
              Reset application
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

class AppContent extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    searchQuery: getLastSearch(),
    results: [],
    lastExecutedSearch: null,
    isLoading: false,
    errorMessage: '',
    shouldSimulateCrash: false,
  };

  private readonly onQueryChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({ searchQuery: event.target.value });
  };

  private readonly simulateAppError = (): void => {
    this.setState({ shouldSimulateCrash: true });
  };

  private readonly requestJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new HttpError(
        response.status,
        response.statusText,
        getHttpErrorMessage(response.status)
      );
    }
    return (await response.json()) as T;
  };

  private readonly fetchPokemon = async (
    query: string
  ): Promise<PokemonResult | null> => {
    const slug = query.trim().toLowerCase();
    if (!slug) return null;

    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(slug)}`;
    const pokemonData = await this.requestJson<PokemonResponse>(url);
    return {
      name: pokemonData.name,
      stats: pokemonData.stats.map(
        (stat) => `${stat.stat.name} - ${stat.base_stat}`
      ),
    };
  };

  private readonly fetchFirstPagePokemon = async (): Promise<
    PokemonResult[]
  > => {
    const listData = await this.requestJson<PokemonListResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${FIRST_PAGE_LIMIT}&offset=0`
    );
    const detailed = await Promise.all(
      listData.results.map((item) => this.fetchPokemon(item.name))
    );
    return detailed.filter((item): item is PokemonResult => item !== null);
  };

  private readonly fetchFirstPageMatchingPokemon = async (
    searchTerm: string
  ): Promise<PokemonResult[]> => {
    const normalizedTerm = searchTerm.toLowerCase();
    const params = new URLSearchParams({
      limit: '200',
      offset: '0',
      search: normalizedTerm,
    });

    const listData = await this.requestJson<PokemonListResponse>(
      `https://pokeapi.co/api/v2/pokemon?${params.toString()}`
    );
    const matches = listData.results
      .filter((item) => item.name.includes(normalizedTerm))
      .slice(0, FIRST_PAGE_LIMIT);

    const detailed = await Promise.all(
      matches.map((item) => this.fetchPokemon(item.name))
    );
    return detailed.filter((item): item is PokemonResult => item !== null);
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
      await delay(500);
      const results = normalizedTerm
        ? await this.fetchFirstPageMatchingPokemon(normalizedTerm)
        : await this.fetchFirstPagePokemon();

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
        <section className="search-section">
          <h2>Search area:</h2>
          <button
            className="simulate-error-button"
            onClick={this.simulateAppError}
          >
            Test Error Boundary
          </button>
          <form action="#" onSubmit={this.onSubmit}>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={this.onQueryChange}
              aria-label="Search terms"
            />
            <button className="search-button">Search</button>
          </form>
        </section>

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
