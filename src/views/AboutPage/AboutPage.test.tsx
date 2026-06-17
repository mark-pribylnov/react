import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutPageContent } from '../../content/aboutPageContent';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('shows author and course links', () => {
    render(<AboutPage />);

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
