import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../context/ThemeProvider.tsx';
import { store } from '../store/store.ts';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
