import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { isAppLocale } from './config';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  const cookieLocale = (await cookies()).get('locale')?.value;

  if (cookieLocale && isAppLocale(cookieLocale)) {
    locale = cookieLocale;
  }

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
