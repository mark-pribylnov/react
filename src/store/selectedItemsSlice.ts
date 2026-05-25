import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getPokemonItemKey } from '../lib/pokemonItemKey';
import type { SelectedPokemonItem } from '../types/selectedPokemonItem';

export type SelectedItemsState = {
  items: SelectedPokemonItem[];
};

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem(state, action: PayloadAction<SelectedPokemonItem>) {
      const key = getPokemonItemKey(action.payload.pokemon);
      const index = state.items.findIndex(
        (item) => getPokemonItemKey(item.pokemon) === key
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
