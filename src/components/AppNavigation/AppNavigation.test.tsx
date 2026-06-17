import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navigationMock } from '../../test-utils/navigationMock';
import AppNavigation from './AppNavigation';

describe('AppNavigation', () => {
  it('renders search and about links', () => {
    navigationMock.setInitialEntry('/');

    render(<AppNavigation />);

    expect(screen.getByRole('link', { name: /search/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });
});
