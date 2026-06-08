import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import countriesReducer from '../store/slices/countriesSlice';
import formSubmissionsReducer from '../store/slices/formSubmissionsSlice';

function setupStore() {
  return configureStore({
    reducer: {
      formSubmissions: formSubmissionsReducer,
      countries: countriesReducer,
    },
  });
}

type AppStore = ReturnType<typeof setupStore>;

type ExtendedRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  store?: AppStore;
};

export function renderWithProviders(
  ui: ReactElement,
  { store = setupStore(), ...renderOptions }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function createTestStore() {
  return setupStore();
}
