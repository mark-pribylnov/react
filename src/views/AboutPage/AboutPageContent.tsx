import { aboutPageContent } from '../../content/aboutPageContent';
import './AboutPage.scss';

export type AboutPageContentProps = {
  heading: string;
  intro: string;
  authorLabel: string;
  courseLabel: string;
  courseLinkLabel: string;
  authorName?: string;
  githubProfileUrl?: string;
  rsSchoolReactCourseUrl?: string;
};

export function AboutPageContent({
  heading,
  intro,
  authorLabel,
  courseLabel,
  courseLinkLabel,
  authorName = aboutPageContent.authorName,
  githubProfileUrl = aboutPageContent.githubProfileUrl,
  rsSchoolReactCourseUrl = aboutPageContent.rsSchoolReactCourseUrl,
}: AboutPageContentProps) {
  return (
    <section className="about-page">
      <h1 className="about-page__heading">{heading}</h1>
      <p className="about-page__intro">{intro}</p>
      <dl className="about-page__details">
        <div className="about-page__detail">
          <dt className="about-page__term">{authorLabel}</dt>
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
          <dt className="about-page__term">{courseLabel}</dt>
          <dd className="about-page__definition">
            <a
              href={rsSchoolReactCourseUrl}
              target="_blank"
              rel="noreferrer"
              className="about-page__link"
            >
              {courseLinkLabel}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
