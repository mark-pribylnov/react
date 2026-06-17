import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { useSyncExternalStore, type MouseEvent, type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';
import { navigationMock } from './test-utils/navigationMock';

vi.mock('next/navigation', () => ({
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
  useSearchParams: () =>
    useSyncExternalStore(
      navigationMock.subscribe,
      () => navigationMock.searchParams,
      () => navigationMock.searchParams
    ),
}));

vi.mock('next/link', () => ({
  default: ({
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
}));

afterEach(() => {
  cleanup();
  navigationMock.reset();
});
