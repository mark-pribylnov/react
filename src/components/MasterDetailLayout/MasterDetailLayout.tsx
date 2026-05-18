import type { ReactNode } from 'react';
import { Outlet, useMatch } from 'react-router';
import type { HomeOutletContext } from '../../types/homeOutletContext';
import './MasterDetailLayout.scss';

export type MasterDetailLayoutProps = {
  children: ReactNode;
  onListPanelClick: () => void;
  outletContext: HomeOutletContext;
};

export default function MasterDetailLayout({
  children,
  onListPanelClick,
  outletContext,
}: MasterDetailLayoutProps) {
  const isDetailsOpen = Boolean(useMatch({ path: '/details', end: true }));

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
        <aside className="master-detail__details">
          <Outlet context={outletContext} />
        </aside>
      ) : null}
    </div>
  );
}
