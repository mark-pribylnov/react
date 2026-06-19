import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import AppRouter from './AppRouter';
import AppLayout from './layouts/AppLayout';
import { ThemeProvider } from './context/ThemeProvider';
import { setupStore } from './store/store';
import { navigationMock } from './test-utils/navigationMock';
import { TestIntlProvider } from './test-utils/TestIntlProvider';

function renderAppRouter(pathname: string) {
  navigationMock.setInitialEntry(pathname);

  return render(
    <TestIntlProvider>
      <Provider store={setupStore()}>
        <ThemeProvider>
          <AppLayout>
            <AppRouter />
          </AppLayout>
        </ThemeProvider>
      </Provider>
    </TestIntlProvider>
  );
}

describe('AppRouter', () => {
  it('shows the 404 page for unknown routes', () => {
    renderAppRouter('/does-not-exist');

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to main app/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('keeps the shared layout visible on the 404 page', () => {
    renderAppRouter('/unknown-route');

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /application language/i })).toBeInTheDocument();
  });
});
