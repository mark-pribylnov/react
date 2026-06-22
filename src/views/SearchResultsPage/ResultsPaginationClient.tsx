'use client';

import { usePathname, useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import {
  buildListSearchParams,
  readDetailsIndexFromSearchParams,
  readSearchFromSearchParams,
} from '../../lib/searchParams';
import type { PageDirection } from '../../types/otherTypes';

type ResultsPaginationClientProps = {
  currentPage: number;
  totalPages: number;
};

export function ResultsPaginationClient({
  currentPage,
  totalPages,
}: ResultsPaginationClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateToPage = (nextPage: number): void => {
    const params = searchParams ?? new URLSearchParams();
    const search = buildListSearchParams({
      page: nextPage,
      detailsIndex: readDetailsIndexFromSearchParams(params),
      search: readSearchFromSearchParams(params),
    });

    router.push(`${pathname}${search}`);
  };

  const onPageSwitch = (direction: PageDirection): void => {
    let delta = 0;

    if (direction === 'prev' && currentPage >= 2) {
      delta = -1;
    }

    if (direction === 'next' && totalPages > currentPage) {
      delta = 1;
    }

    navigateToPage(currentPage + delta);
  };

  return (
    <PageSwitcher
      currentPage={currentPage}
      totalPages={totalPages}
      onPageSwitch={onPageSwitch}
    />
  );
}
