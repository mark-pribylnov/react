import { getTranslations } from 'next-intl/server';
import { fetchPokemonDetailByName } from '../../lib/pokemonServerApi';
import { localizeErrorMessage } from '../../lib/localizeErrorMessage';
import type { PokemonResult } from '../../types/pokemon';
import { ItemDetailsPanelContent } from './ItemDetailsPanelContent';
import { ItemDetailsPanelHeaderClient } from './ItemDetailsPanelHeaderClient';
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
  const tErrors = await getTranslations('errors');
  const selectedListItem =
    detailsIndex != null ? results[detailsIndex - 1] : undefined;

  let body = (
    <div className="item-details-panel__placeholder" aria-hidden="true" />
  );

  if (detailsIndex != null && !selectedListItem) {
    body = (
      <p className="item-details-panel__error" role="alert">
        {t('itemUnavailable')}
      </p>
    );
  }

  if (selectedListItem) {
    const { pokemon, errorMessage } = await fetchPokemonDetailByName(
      selectedListItem.name
    );

    body = (
      <ItemDetailsPanelContent
        pokemon={pokemon}
        errorMessage={localizeErrorMessage(errorMessage, tErrors)}
        imageAltLabel={t('imageAlt', { name: selectedListItem.name })}
      />
    );
  }

  return (
    <section className="item-details-panel" aria-label={t('ariaLabel')}>
      <ItemDetailsPanelHeaderClient />
      {body}
    </section>
  );
}
