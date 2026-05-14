import type { PageDirection } from '../../types/otherTypes';
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
  return (
    <div className="page-switcher">
      <button type="button" onClick={() => onPageSwitch('prev')}>
        ← Previous page
      </button>
      <span className="page-number">
        {currentPage} / {totalPages}
      </span>
      <button type="button" onClick={() => onPageSwitch('next')}>
        Next page →
      </button>
    </div>
  );
}
