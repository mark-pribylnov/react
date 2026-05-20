import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { delay } from '../lib/delay';
import { getErrorMessage } from '../lib/httpError';
import { PokemonApi } from '../services/pokemonApi';
import type { PokemonResult } from '../types/pokemon';

const LOADING_DELAY_MS = 200;

export type SearchState = {
  searchQuery: string;
  results: PokemonResult[];
  lastExecutedSearch: string | null;
  isLoading: boolean;
  errorMessage: string;
  shouldSimulateCrash: boolean;
};

const initialState: SearchState = {
  searchQuery: '',
  results: [],
  lastExecutedSearch: null,
  isLoading: false,
  errorMessage: '',
  shouldSimulateCrash: false,
};

export const runSearch = createAsyncThunk(
  'search/runSearch',
  async (normalizedTerm: string) => {
    await delay(LOADING_DELAY_MS);
    const api = new PokemonApi();
    const results = normalizedTerm
      ? await api.fetchPokemonSearchResults(normalizedTerm)
      : await api.fetchFirstPagePokemon();

    return { normalizedTerm, results };
  }
);

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
    setShouldSimulateCrash(state, action: PayloadAction<boolean>) {
      state.shouldSimulateCrash = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runSearch.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = '';
        state.searchQuery = action.meta.arg;
      })
      .addCase(runSearch.fulfilled, (state, action) => {
        const { normalizedTerm, results } = action.payload;
        state.isLoading = false;
        state.results = results;
        state.lastExecutedSearch = normalizedTerm;
        state.errorMessage =
          normalizedTerm && results.length === 0
            ? 'No results found for this search.'
            : '';
      })
      .addCase(runSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.results = [];
        state.lastExecutedSearch = action.meta.arg;
        state.errorMessage =
          action.error.message ?? getErrorMessage(action.error);
      });
  },
});

export const { setSearchQuery, normalizeSearchQuery, setShouldSimulateCrash } =
  searchSlice.actions;

export const searchReducer = searchSlice.reducer;
