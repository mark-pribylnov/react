import { createSlice } from '@reduxjs/toolkit';
import { COUNTRIES } from '../../constants/countries';

export type CountriesState = {
  list: readonly string[];
};

const initialState: CountriesState = {
  list: COUNTRIES,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const selectCountries = (state: { countries: CountriesState }) =>
  state.countries.list;

export default countriesSlice.reducer;
