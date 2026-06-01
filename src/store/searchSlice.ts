import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SearchState = {
  searchQuery: string;
  lastExecutedSearch: string | null;
  shouldSimulateCrash: boolean;
};

const initialState: SearchState = {
  searchQuery: '',
  lastExecutedSearch: null,
  shouldSimulateCrash: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    normalizeSearchQuery(state) {
      state.searchQuery = state.searchQuery.trim();
    },
    setLastExecutedSearch(state, action: PayloadAction<string>) {
      state.lastExecutedSearch = action.payload;
    },
    setShouldSimulateCrash(state, action: PayloadAction<boolean>) {
      state.shouldSimulateCrash = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  normalizeSearchQuery,
  setLastExecutedSearch,
  setShouldSimulateCrash,
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
