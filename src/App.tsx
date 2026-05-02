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
};

const LOCAL_STORAGE_PROPERTIES = Object.freeze({
  searches: 'searches',
});
const FIRST_PAGE_LIMIT = 10;

function readSavedSearches(): string[] {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PROPERTIES.searches) ?? '[]'
    );
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function saveSearchTerm(term: string): void {
  const searches = readSavedSearches();
  searches.push(term);
  localStorage.setItem(
    LOCAL_STORAGE_PROPERTIES.searches,
    JSON.stringify(searches)
  );
}

function getLastSearch(): string {
  const searches = readSavedSearches();
  return searches.at(-1) ?? '';
}

class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    searchQuery: getLastSearch(),
    results: [],
  };

  private readonly onQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchQuery: event.target.value });
  };

  private readonly fetchPokemon = async (query: string): Promise<PokemonResult | null> => {
    const slug = query.trim().toLowerCase();
    if (!slug) return null;

    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(slug)}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const pokemonData = (await response.json()) as PokemonResponse;
    return {
      name: pokemonData.name,
      stats: pokemonData.stats.map(
        (stat) => `${stat.stat.name} - ${stat.base_stat}`
      ),
    };
  };

  private readonly fetchFirstPagePokemon = async (): Promise<PokemonResult[]> => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${FIRST_PAGE_LIMIT}&offset=0`
    );
    if (!response.ok) return [];

    const listData = (await response.json()) as PokemonListResponse;
    const detailed = await Promise.all(
      listData.results.map((item) => this.fetchPokemon(item.name))
    );
    return detailed.filter((item): item is PokemonResult => item !== null);
  };

  private readonly loadInitialResults = async (): Promise<void> => {
    const term = this.state.searchQuery.trim();

    if (term) {
      const pokemon = await this.fetchPokemon(term);
      this.setState({ results: pokemon ? [pokemon] : [] });
      return;
    }

    const firstPage = await this.fetchFirstPagePokemon();
    this.setState({ results: firstPage });
  };

  componentDidMount(): void {
    void this.loadInitialResults();
  }

  private readonly onSubmit = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const term = this.state.searchQuery.trim();

    if (!term) {
      const firstPage = await this.fetchFirstPagePokemon();
      this.setState({ results: firstPage });
      return;
    }

    saveSearchTerm(term);
    const pokemon = await this.fetchPokemon(term);
    this.setState({ results: pokemon ? [pokemon] : [] });
  };

  render() {
    const { searchQuery, results } = this.state;

    return (
      <div className="app-container">
        <section className="search-section">
          <h2>Search area:</h2>
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
              {results.length === 0 ? (
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

export default App;
