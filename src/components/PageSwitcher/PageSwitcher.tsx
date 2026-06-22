'use client';

import type { PageDirection } from '../../types/otherTypes';
import { useTranslations } from 'next-intl';
import './PageSwitcher.scss';

export type PageSwitcherProps = {
  currentPage: number;
  totalPages: number;
  onPageSwitch: (direction: PageDirection) => void;
};

export default function PageSwitcher({
  currentPage,
  totalPages,
  onPageSwitch,
}: PageSwitcherProps) {
  const t = useTranslations('pageSwitcher');

  return (
    <div className="page-switcher">
      <button type="button" onClick={() => onPageSwitch('prev')}>
        {t('previous')}
      </button>
      <span className="page-number">
        {currentPage} / {totalPages}
      </span>
      <button type="button" onClick={() => onPageSwitch('next')}>
        {t('next')}
      </button>
    </div>
  );
}
