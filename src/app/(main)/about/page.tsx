import { getTranslations } from 'next-intl/server';
import { AboutPageContent } from '../../../views/AboutPage/AboutPageContent';

export const dynamic = 'force-static';

export default async function AboutPage() {
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
