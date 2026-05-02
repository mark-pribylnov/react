import { useState } from 'react';
import type * as React from 'react';
import './App.css';

const LOCAL_STORAGE_PROPERTIES = {
  searches: 'searches',
};

function App() {
  const [searchQuery, setSearchQuery] = useState(getLastSearch());

  function onSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    const searches =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROPERTIES.searches)) ?? [];
    searches.push(searchQuery);

    localStorage.setItem(
      LOCAL_STORAGE_PROPERTIES.searches,
      JSON.stringify(searches)
    );

    console.log(searches);
  }

  function getLastSearch(): string {
    const searches = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PROPERTIES.searches)
    );
    return !searches ? '' : searches.at(-1);
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
              <th scope="col">Item Name</th>
              <th scope="col">Item Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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
