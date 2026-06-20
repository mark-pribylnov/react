import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { useSyncExternalStore, type MouseEvent, type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';
import { navigationMock } from './test-utils/navigationMock';

vi.mock('next/navigation', () => ({
  useSearchParams: () =>
    useSyncExternalStore(
      navigationMock.subscribe,
      () => navigationMock.searchParams,
      () => navigationMock.searchParams
    ),
}));

vi.mock('./i18n/navigation', () => ({
  Link: ({
    href,
    children,
    onClick,
    className,
  }: {
    href: string;
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
  }) => (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigationMock.push(href);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
  useRouter: () => ({
    push: (url: string) => {
      navigationMock.push(url);
    },
    replace: vi.fn(),
  }),
  usePathname: () =>
    useSyncExternalStore(
      navigationMock.subscribe,
      () => navigationMock.pathname,
      () => navigationMock.pathname
    ),
  redirect: vi.fn(),
  getPathname: ({ href }: { href: string }) => href,
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

afterEach(() => {
  cleanup();
  navigationMock.reset();
});
