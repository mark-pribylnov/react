import { getTranslations } from 'next-intl/server';
import type { PokemonResult } from '../../types/pokemon';
import { ItemDetailsCloseButton } from './ItemDetailsCloseButton';
import { ItemDetailsPanelClient } from './ItemDetailsPanelClient';
import '../../components/ItemDetailsPanel/ItemDetailsPanel.scss';

type ItemDetailsPanelShellProps = {
  results: PokemonResult[];
  detailsIndex: number | null;
};

export async function ItemDetailsPanelShell({
  results,
  detailsIndex,
}: ItemDetailsPanelShellProps) {
  const t = await getTranslations('detailsPanel');

  return (
    <section className="item-details-panel" aria-label={t('ariaLabel')}>
      <header className="item-details-panel__header">
        <h2 className="item-details-panel__title">{t('title')}</h2>
        <ItemDetailsCloseButton label={t('close')} />
      </header>
      <ItemDetailsPanelClient
        results={results}
        detailsIndex={detailsIndex}
        itemUnavailableLabel={t('itemUnavailable')}
      />
    </section>
  );
}
