'use client';

import type { ReactNode } from 'react';
import { useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import {
  buildListSearchParams,
  readPageFromSearchParams,
  readSearchFromSearchParams,
} from '../../lib/searchParams';

type MasterDetailListClientProps = {
  children: ReactNode;
  isDetailsOpen: boolean;
};

export function MasterDetailListClient({
  children,
  isDetailsOpen,
}: MasterDetailListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleListPanelClick = (): void => {
    if (!isDetailsOpen) {
      return;
    }

    const params = searchParams ?? new URLSearchParams();
    const search = buildListSearchParams({
      page: readPageFromSearchParams(params),
      detailsIndex: null,
      search: readSearchFromSearchParams(params),
    });

    router.push(`/${search}`);
  };

  return (
    <div
      className="master-detail__list"
      onClick={handleListPanelClick}
      role="presentation"
    >
      {children}
    </div>
  );
}
