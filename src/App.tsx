import './App.css';

function App() {
  return (
    <div className="app-container">
      <section className="search-section">
        <h2>Search area:</h2>
        <input
          type="text"
          placeholder="Enter search terms..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </section>

      <section className="results-section">
        <h2>Result area:</h2>
        <p>Nothing to show yet</p>
      </section>
    </div>
  );
}

export default App;
