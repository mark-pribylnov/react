import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import AppNavigation from './AppNavigation';

describe('AppNavigation', () => {
  it('renders search and about links', () => {
    render(
      <MemoryRouter>
        <AppNavigation />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /search/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });
});
