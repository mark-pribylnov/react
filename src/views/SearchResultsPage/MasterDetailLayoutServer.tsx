import type { ReactNode } from 'react';
import { MasterDetailListClient } from './MasterDetailListClient';
import '../../components/MasterDetailLayout/MasterDetailLayout.scss';

type MasterDetailLayoutServerProps = {
  children: ReactNode;
  detailsPanel: ReactNode;
  isDetailsOpen: boolean;
};

export function MasterDetailLayoutServer({
  children,
  detailsPanel,
  isDetailsOpen,
}: MasterDetailLayoutServerProps) {
  return (
    <div
      className={
        isDetailsOpen ? 'master-detail master-detail--split' : 'master-detail'
      }
    >
      <MasterDetailListClient isDetailsOpen={isDetailsOpen}>
        {children}
      </MasterDetailListClient>
      {isDetailsOpen ? (
        <aside className="master-detail__details">{detailsPanel}</aside>
      ) : null}
    </div>
  );
}
