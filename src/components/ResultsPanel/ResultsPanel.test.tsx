import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResultsPanel from './ResultsPanel';

const sampleResults = [
  {
    name: 'bulbasaur',
    stats: ['hp - 45', 'attack - 49'],
  },
];

describe('ResultsPanel', () => {
  it('shows loading state', () => {
    render(<ResultsPanel isLoading errorMessage="" results={[]} />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading results/i);
  });

  it('shows error message', () => {
    render(
      <ResultsPanel
        isLoading={false}
        errorMessage="Request failed"
        results={[]}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Request failed');
  });

  it('shows empty placeholder when there are no results', () => {
    render(<ResultsPanel isLoading={false} errorMessage="" results={[]} />);
    expect(screen.getAllByText('Nothing to show yet')).toHaveLength(2);
  });

  it('renders one row per result with stats', () => {
    render(
      <ResultsPanel isLoading={false} errorMessage="" results={sampleResults} />
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText('hp - 45')).toBeInTheDocument();
    expect(screen.getByText('attack - 49')).toBeInTheDocument();
  });
});
