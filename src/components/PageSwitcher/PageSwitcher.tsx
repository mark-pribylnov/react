import './PageSwitcher.scss';
import { useState } from 'react';

export type PageSwitcherProps = {
  currentPage: number;
  onPageSwitch?: (direction: 'prev' | 'next') => void;
};

export default function PageSwitcher({
  currentPage,
  onPageSwitch,
}: PageSwitcherProps) {
  const [pageCount, setPageCount] = useState(currentPage);

  function handleClick(direction: 'prev' | 'next'): void {
    if (direction === 'prev') setPageCount((c) => c - 1);
    if (direction === 'next') setPageCount((c) => c + 1);
    onPageSwitch?.(direction);
  }

  return (
    <div className="page-switcher">
      <button type="button" onClick={() => handleClick('prev')}>
        ← Previous page
      </button>
      <span className="page-number">{pageCount}</span>
      <button type="button" onClick={() => handleClick('next')}>
        Next page →
      </button>
    </div>
  );
}
