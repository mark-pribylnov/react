import type { ReactNode } from 'react';
import { LocaleProvider } from '../context/LocaleProvider';
import enMessages from '../../messages/en.json';

export function TestIntlProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale="en" messages={enMessages}>
      {children}
    </LocaleProvider>
  );
}
