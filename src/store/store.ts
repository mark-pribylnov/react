import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './slices/countriesSlice';
import formSubmissionsReducer from './slices/formSubmissionsSlice';

export const store = configureStore({
  reducer: {
    formSubmissions: formSubmissionsReducer,
    countries: countriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
