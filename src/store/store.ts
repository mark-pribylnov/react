import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { searchReducer } from './searchSlice';
import { selectedItemsReducer } from './selectedItemsSlice';

const rootReducer = combineReducers({
  search: searchReducer,
  selectedItems: selectedItemsReducer,
});

export function setupStore(
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
