import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ResultsPanel from './ResultsPanel';

const noopSetPage = vi.fn();

const sampleResults = [
  {
    name: 'bulbasaur',
    stats: ['hp - 45', 'attack - 49'],
  },
];

describe('ResultsPanel', () => {
  it('shows loading state', () => {
    render(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading
        errorMessage=""
        results={[]}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent(/loading results/i);
    expect(
      screen.queryByRole('button', { name: /previous page/i })
    ).not.toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage="Request failed"
        results={[]}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Request failed');
  });

  it('shows empty placeholder when there are no results', () => {
    render(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage=""
        results={[]}
      />
    );
    expect(screen.getAllByText('Nothing to show yet')).toHaveLength(2);
  });

  it('renders one row per result with stats', () => {
    render(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage=""
        results={sampleResults}
      />
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText('hp - 45')).toBeInTheDocument();
    expect(screen.getByText('attack - 49')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /previous page/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('hides pagination while loading and when there are no results', () => {
    const { rerender } = render(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage=""
        results={[]}
      />
    );
    expect(
      screen.queryByRole('button', { name: /previous page/i })
    ).not.toBeInTheDocument();

    rerender(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading
        errorMessage=""
        results={sampleResults}
      />
    );
    expect(
      screen.queryByRole('button', { name: /previous page/i })
    ).not.toBeInTheDocument();
  });
});
