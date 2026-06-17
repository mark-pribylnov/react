import type { ReactNode } from 'react';
import './MasterDetailLayout.scss';

export type MasterDetailLayoutProps = {
  children: ReactNode;
  detailsPanel: ReactNode;
  isDetailsOpen: boolean;
  onListPanelClick: () => void;
};

export default function MasterDetailLayout({
  children,
  detailsPanel,
  isDetailsOpen,
  onListPanelClick,
}: MasterDetailLayoutProps) {
  return (
    <div
      className={
        isDetailsOpen ? 'master-detail master-detail--split' : 'master-detail'
      }
    >
      <div
        className="master-detail__list"
        onClick={onListPanelClick}
        role="presentation"
      >
        {children}
      </div>
      {isDetailsOpen ? (
        <aside className="master-detail__details">{detailsPanel}</aside>
      ) : null}
    </div>
  );
}
