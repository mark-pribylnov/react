import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '../../constants/countries';
import { selectCountries } from './countriesSlice';

describe('countriesSlice', () => {
  it('selectCountries returns the stored countries list', () => {
    const state = {
      countries: {
        list: COUNTRIES,
      },
    };

    expect(selectCountries(state)).toEqual(COUNTRIES);
  });
});
