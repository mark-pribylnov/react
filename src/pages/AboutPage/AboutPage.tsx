import { aboutPageContent } from '../../content/aboutPageContent';
import './AboutPage.scss';

export default function AboutPage() {
  const { authorName, githubProfileUrl, rsSchoolReactCourseUrl } =
    aboutPageContent;

  return (
    <section className="about-page">
      <h1 className="about-page__heading">About</h1>
      <p className="about-page__intro">
        This application was built for the RS School React course project.
      </p>
      <dl className="about-page__details">
        <div className="about-page__detail">
          <dt className="about-page__term">Author</dt>
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
          <dt className="about-page__term">Course</dt>
          <dd className="about-page__definition">
            <a
              href={rsSchoolReactCourseUrl}
              target="_blank"
              rel="noreferrer"
              className="about-page__link"
            >
              RS School React course
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
