'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { isAppLocale, type AppLocale } from '../i18n/config';
import { LocaleContext } from './localeContext';

type LocaleProviderProps = {
  children: ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
};

export function LocaleProvider({
  children,
  locale: initialLocale,
  messages: initialMessages,
}: LocaleProviderProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);

  async function switchLocale(nextLocale: AppLocale) {
    document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
    const nextMessages = (await import(`../../messages/${nextLocale}.json`))
      .default;
    setLocale(nextLocale);
    setMessages(nextMessages);
    document.documentElement.lang = nextLocale;
  }

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
    const cookieLocale = match?.[1];
    if (cookieLocale && isAppLocale(cookieLocale) && cookieLocale !== initialLocale) {
      void import(`../../messages/${cookieLocale}.json`).then(
        ({ default: nextMessages }) => {
          setLocale(cookieLocale);
          setMessages(nextMessages);
          document.documentElement.lang = cookieLocale;
        }
      );
    }
  }, [initialLocale]);

  return (
    <LocaleContext.Provider value={{ switchLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="UTC"
        now={new Date()}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
