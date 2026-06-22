'use client';

import { useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import {
  buildListSearchParams,
  readPageFromSearchParams,
  readSearchFromSearchParams,
} from '../../lib/searchParams';

type ItemDetailsCloseButtonProps = {
  label: string;
};

export function ItemDetailsCloseButton({ label }: ItemDetailsCloseButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = (): void => {
    const params = searchParams ?? new URLSearchParams();
    const search = buildListSearchParams({
      page: readPageFromSearchParams(params),
      detailsIndex: null,
      search: readSearchFromSearchParams(params),
    });

    router.push(`/${search}`);
  };

  return (
    <button
      type="button"
      className="item-details-panel__close"
      onClick={handleClose}
    >
      {label}
    </button>
  );
}
