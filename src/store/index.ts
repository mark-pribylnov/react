export { store, setupStore } from './store';
export type { AppDispatch, AppStore, RootState } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export {
  invalidateAllPokemonCache,
  pokemonApi,
  useGetPokemonByNameQuery,
  useGetFirstPagePokemonQuery,
  useGetPokemonSearchResultsQuery,
} from './pokemonApi';
export {
  normalizeSearchQuery,
  runSearch,
  searchReducer,
  setSearchQuery,
  setShouldSimulateCrash,
} from './searchSlice';
export type { SearchState } from './searchSlice';
export {
  clearSelectedItems,
  selectedItemsReducer,
  toggleSelectedItem,
} from './selectedItemsSlice';
export type { SelectedItemsState } from './selectedItemsSlice';
export type { SelectedPokemonItem } from '../types/selectedPokemonItem';
