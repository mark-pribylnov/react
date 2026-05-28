import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from './pokemonApi';
import { searchReducer } from './searchSlice';
import { selectedItemsReducer } from './selectedItemsSlice';

const rootReducer = combineReducers({
  search: searchReducer,
  selectedItems: selectedItemsReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer,
});

export function setupStore(
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
