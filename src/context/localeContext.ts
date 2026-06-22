import { createContext } from 'react';
import type { AppLocale } from '../i18n/config';

export type LocaleContextValue = {
  switchLocale: (locale: AppLocale) => Promise<void>;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);
