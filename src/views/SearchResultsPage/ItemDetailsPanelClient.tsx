'use client';

import { useTranslations } from 'next-intl';
import { getErrorMessage } from '../../lib/httpError';
import { useLocalizedErrorMessage } from '../../hooks/useLocalizedErrorMessage';
import { useGetPokemonByNameQuery } from '../../store';
import type { PokemonResult } from '../../types/pokemon';
import PokemonImage from '../../components/PokemonImage/PokemonImage';
import '../../components/ItemDetailsPanel/ItemDetailsPanel.scss';

type PokemonDetailsBodyProps = {
  pokemonName: string;
};

function PokemonDetailsBody({ pokemonName }: PokemonDetailsBodyProps) {
  const t = useTranslations('detailsPanel');
  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useGetPokemonByNameQuery(pokemonName);

  const rawErrorMessage = isError
    ? getErrorMessage(error)
    : !isLoading && !pokemon
      ? 'Could not load details for this item.'
      : '';
  const errorMessage = useLocalizedErrorMessage(rawErrorMessage);

  if (isLoading) {
    return (
      <div className="loading-indicator" role="status">
        <span className="loading-spinner" />
        {t('loading')}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <p className="item-details-panel__error" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (!pokemon) {
    return null;
  }

  return (
    <article className="item-details-panel__content">
      {pokemon.imageUrl ? (
        <PokemonImage
          src={pokemon.imageUrl}
          alt={t('imageAlt', { name: pokemon.name })}
          width={160}
          height={160}
          className="item-details-panel__image"
        />
      ) : null}
      <h3 className="item-details-panel__name">{pokemon.name}</h3>
      <ul className="item-details-panel__stats">
        {pokemon.stats.map((stat) => (
          <li key={stat}>{stat}</li>
        ))}
      </ul>
    </article>
  );
}

type ItemDetailsPanelClientProps = {
  results: PokemonResult[];
  detailsIndex: number | null;
  itemUnavailableLabel: string;
};

export function ItemDetailsPanelClient({
  results,
  detailsIndex,
  itemUnavailableLabel,
}: ItemDetailsPanelClientProps) {
  const selectedListItem =
    detailsIndex != null ? results[detailsIndex - 1] : undefined;

  if (detailsIndex == null) {
    return (
      <div className="item-details-panel__placeholder" aria-hidden="true" />
    );
  }

  if (!selectedListItem) {
    return (
      <p className="item-details-panel__error" role="alert">
        {itemUnavailableLabel}
      </p>
    );
  }

  return (
    <PokemonDetailsBody
      key={selectedListItem.name}
      pokemonName={selectedListItem.name}
    />
  );
}
