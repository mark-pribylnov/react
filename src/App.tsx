import { useRef, useState } from 'react';
import type * as React from 'react';
import { buildStatsList } from './buildStatsList';
import { pasteStatsListIntoTable } from './pasteStatsListIntoTable';
import './App.css';

type PokemonStat = {
  base_stat: number;
  stat: { name: string };
};

const LOCAL_STORAGE_PROPERTIES = {
  searches: 'searches',
};

function App() {
  const [searchQuery, setSearchQuery] = useState(getLastSearch());
  const resultsBodyRef = useRef<HTMLTableSectionElement>(null);

  async function requestResults(query: string = 'abra'): Promise<void> {
    const url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
    const res = await fetch(url);
    const pokemonData = await res.json();
    const stats: PokemonStat[] = pokemonData.stats;
    const statStrings = stats.map(
      (stat) => `${stat.stat.name} - ${stat.base_stat}`
    );
    const statsList = buildStatsList(statStrings);
    const pokemonName = pokemonData.name;

    const tbody = resultsBodyRef.current;
    if (!tbody) return;
    pasteStatsListIntoTable(
      tbody,
      statsList,
      String(pokemonName ?? '')
    );
  }

  function onSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    const searches =
      JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_PROPERTIES.searches) ?? '[]'
      ) ?? [];
    searches.push(searchQuery);

    localStorage.setItem(
      LOCAL_STORAGE_PROPERTIES.searches,
      JSON.stringify(searches)
    );

    void requestResults(searchQuery);
  }

  function getLastSearch(): string {
    const searches = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PROPERTIES.searches) ?? '[]'
    );
    const last = Array.isArray(searches) ? searches.at(-1) : undefined;
    return typeof last === 'string' ? last : '';
  }

  return (
    <div className="app-container">
      <section className="search-section">
        <h2>Search area:</h2>
        <form action="#" onSubmit={onSubmit}>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
          <tbody ref={resultsBodyRef}>
            <tr data-placeholder="true">
              <td>Nothing to show yet</td>
              <td>Nothing to show yet</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
