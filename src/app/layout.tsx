import type { Metadata } from 'next';
import { getLocale, getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import '../index.css';
import { defaultLocale, isAppLocale } from '../i18n/config';
import { AppProviders } from './AppProviders';

export async function generateMetadata(): Promise<Metadata> {
  setRequestLocale(defaultLocale);
  const t = await getTranslations('metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localeValue = await getLocale();
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <AppProviders locale={locale} messages={messages}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
