'use client';

import type { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import { Provider } from 'react-redux';
import { LocaleProvider } from '../context/LocaleProvider.tsx';
import { ThemeProvider } from '../context/ThemeProvider.tsx';
import type { AppLocale } from '../i18n/config';
import { store } from '../store/store.ts';

type AppProvidersProps = {
  children: ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
};

export function AppProviders({ children, locale, messages }: AppProvidersProps) {
  return (
    <LocaleProvider locale={locale} messages={messages}>
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </LocaleProvider>
  );
}
