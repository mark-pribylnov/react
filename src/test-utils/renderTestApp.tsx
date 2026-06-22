import { Provider } from 'react-redux';
import AppLayout from '../layouts/AppLayout';
import { ThemeProvider } from '../context/ThemeProvider';
import { setupStore } from '../store/store';
import { navigationMock } from './navigationMock';
import { renderWithUser } from './renderWithUser';
import { TestAppContent } from './TestAppContent';

export function renderTestApp(initialEntries: string[] = ['/']) {
  navigationMock.setInitialEntry(initialEntries[0] ?? '/');

  return renderWithUser(
    <Provider store={setupStore()}>
      <ThemeProvider>
        <AppLayout>
          <TestAppContent />
        </AppLayout>
      </ThemeProvider>
    </Provider>
  );
}
