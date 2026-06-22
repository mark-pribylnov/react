import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutPageContent } from '../../content/aboutPageContent';
import enMessages from '../../../messages/en.json';
import { AboutPageContent } from './AboutPageContent';

describe('AboutPageContent', () => {
  it('shows author and course links', () => {
    const t = enMessages.aboutPage;

    render(
      <AboutPageContent
        heading={t.heading}
        intro={t.intro}
        authorLabel={t.author}
        courseLabel={t.course}
        courseLinkLabel={t.courseLink}
      />
    );

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: aboutPageContent.authorName })).toHaveAttribute(
      'href',
      aboutPageContent.githubProfileUrl
    );
    expect(screen.getByRole('link', { name: /rs school react course/i })).toHaveAttribute(
      'href',
      aboutPageContent.rsSchoolReactCourseUrl
    );
  });
});
