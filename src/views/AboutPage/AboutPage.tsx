'use client';

import { aboutPageContent } from '../../content/aboutPageContent';
import { useTranslations } from 'next-intl';
import './AboutPage.scss';

export default function AboutPage() {
  const { authorName, githubProfileUrl, rsSchoolReactCourseUrl } =
    aboutPageContent;
  const t = useTranslations('aboutPage');

  return (
    <section className="about-page">
      <h1 className="about-page__heading">{t('heading')}</h1>
      <p className="about-page__intro">{t('intro')}</p>
      <dl className="about-page__details">
        <div className="about-page__detail">
          <dt className="about-page__term">{t('author')}</dt>
          <dd className="about-page__definition">
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="about-page__link"
            >
              {authorName}
            </a>
          </dd>
        </div>
        <div className="about-page__detail">
          <dt className="about-page__term">{t('course')}</dt>
          <dd className="about-page__definition">
            <a
              href={rsSchoolReactCourseUrl}
              target="_blank"
              rel="noreferrer"
              className="about-page__link"
            >
              {t('courseLink')}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
