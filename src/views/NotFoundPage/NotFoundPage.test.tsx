import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TestIntlProvider } from '../../test-utils/TestIntlProvider';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('shows not found message and link home', () => {
    render(
      <TestIntlProvider>
        <NotFoundPage />
      </TestIntlProvider>
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to main app/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
