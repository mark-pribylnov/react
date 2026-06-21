'use client';

import { useActionState, useEffect, useRef } from 'react';
import {
  downloadSelectedItemsCsvAction,
  type DownloadCsvState,
} from '../../actions/downloadSelectedItemsCsvAction';
import { triggerCsvDownload } from '../../lib/triggerCsvDownload';
import {
  clearSelectedItems,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { useTranslations } from 'next-intl';
import './SelectedItemsFlyout.scss';

const initialDownloadState: DownloadCsvState = {
  csv: null,
  fileName: null,
  error: null,
};

export default function SelectedItemsFlyout() {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const t = useTranslations('flyout');
  const [downloadState, downloadAction, isDownloadPending] = useActionState(
    downloadSelectedItemsCsvAction,
    initialDownloadState
  );
  const lastDownloadKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!downloadState.csv || !downloadState.fileName) {
      return;
    }

    const downloadKey = `${downloadState.fileName}:${downloadState.csv.length}`;
    if (lastDownloadKeyRef.current === downloadKey) {
      return;
    }

    lastDownloadKeyRef.current = downloadKey;
    triggerCsvDownload(downloadState.csv, downloadState.fileName);
  }, [downloadState]);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = (): void => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = (): void => {
    const formData = new FormData();
    formData.set('items', JSON.stringify(selectedItems));
    formData.set('origin', window.location.origin);
    downloadAction(formData);
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
      {downloadState.error ? (
        <p className="selected-items-flyout__error" role="alert">
          {downloadState.error}
        </p>
      ) : null}
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
          disabled={isDownloadPending}
        >
          {t('download')}
        </button>
      </div>
    </aside>
  );
}
