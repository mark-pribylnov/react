import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AboutPageContent } from '../../../views/AboutPage/AboutPageContent';
import { defaultLocale } from '../../../i18n/config';

export const dynamic = 'force-static';

export default async function AboutPage() {
  setRequestLocale(defaultLocale);
  const t = await getTranslations('aboutPage');

  return (
    <AboutPageContent
      heading={t('heading')}
      intro={t('intro')}
      authorLabel={t('author')}
      courseLabel={t('course')}
      courseLinkLabel={t('courseLink')}
    />
  );
}
