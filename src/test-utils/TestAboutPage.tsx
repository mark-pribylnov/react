'use client';

import enMessages from '../../messages/en.json';
import { AboutPageContent } from '../views/AboutPage/AboutPageContent';

export function TestAboutPage() {
  const t = enMessages.aboutPage;

  return (
    <AboutPageContent
      heading={t.heading}
      intro={t.intro}
      authorLabel={t.author}
      courseLabel={t.course}
      courseLinkLabel={t.courseLink}
    />
  );
}
