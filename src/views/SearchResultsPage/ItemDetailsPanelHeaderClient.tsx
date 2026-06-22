'use client';

import { useTranslations } from 'next-intl';
import { ItemDetailsCloseButton } from './ItemDetailsCloseButton';

export function ItemDetailsPanelHeaderClient() {
  const t = useTranslations('detailsPanel');

  return (
    <header className="item-details-panel__header">
      <h2 className="item-details-panel__title">{t('title')}</h2>
      <ItemDetailsCloseButton label={t('close')} />
    </header>
  );
}
