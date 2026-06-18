'use client';

import { downloadSelectedItemsCsv } from '../../lib/downloadSelectedItemsCsv';
import {
  clearSelectedItems,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { useTranslations } from 'next-intl';
import './SelectedItemsFlyout.scss';

export default function SelectedItemsFlyout() {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const t = useTranslations('flyout');

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = (): void => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = (): void => {
    downloadSelectedItemsCsv(selectedItems);
  };

  const countMessage =
    selectedItems.length === 1
      ? t('countOne', { count: selectedItems.length })
      : t('countMany', { count: selectedItems.length });

  return (
    <aside
      className="selected-items-flyout"
      role="region"
      aria-label={t('ariaLabel')}
    >
      <p className="selected-items-flyout__count">{countMessage}</p>
      <div className="selected-items-flyout__actions">
        <button
          type="button"
          className="selected-items-flyout__button"
          onClick={handleUnselectAll}
        >
          {t('unselectAll')}
        </button>
        <button
          type="button"
          className="selected-items-flyout__button"
          onClick={handleDownload}
        >
          {t('download')}
        </button>
      </div>
    </aside>
  );
}
