export { store, setupStore } from './store';
export type { AppDispatch, AppStore, RootState } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export {
  clearSelectedItems,
  selectedItemsReducer,
  toggleSelectedItem,
} from './selectedItemsSlice';
export type { SelectedItemsState } from './selectedItemsSlice';
