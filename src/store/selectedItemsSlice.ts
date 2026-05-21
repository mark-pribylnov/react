import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getPokemonItemKey } from '../lib/pokemonItemKey';
import type { PokemonResult } from '../types/pokemon';

export type SelectedItemsState = {
  items: PokemonResult[];
};

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem(state, action: PayloadAction<PokemonResult>) {
      const key = getPokemonItemKey(action.payload);
      const index = state.items.findIndex(
        (item) => getPokemonItemKey(item) === key
      );

      if (index === -1) {
        state.items.push(action.payload);
        return;
      }

      state.items.splice(index, 1);
    },
    clearSelectedItems(state) {
      state.items = [];
    },
  },
});

export const { toggleSelectedItem, clearSelectedItems } =
  selectedItemsSlice.actions;

export const selectedItemsReducer = selectedItemsSlice.reducer;
