import { useContext } from 'react';
import { LocaleContext } from './localeContext';

export function useSwitchLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useSwitchLocale must be used within LocaleProvider');
  }
  return context.switchLocale;
}
