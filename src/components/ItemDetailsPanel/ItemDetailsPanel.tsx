'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getErrorMessage } from '../../lib/httpError';
import { useLocalizedErrorMessage } from '../../hooks/useLocalizedErrorMessage';
import { readDetailsIndexFromSearchParams } from '../../lib/searchParams';
import { useGetPokemonByNameQuery } from '../../store';
import type { HomeOutletContext } from '../../types/homeOutletContext';
import './ItemDetailsPanel.scss';

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
      <h3 className="item-details-panel__name">{pokemon.name}</h3>
      <ul className="item-details-panel__stats">
        {pokemon.stats.map((stat) => (
          <li key={stat}>{stat}</li>
        ))}
      </ul>
    </article>
  );
}

type ItemDetailsPanelProps = {
  results: HomeOutletContext['results'];
  closeDetails: () => void;
};

export default function ItemDetailsPanel({
  results,
  closeDetails,
}: ItemDetailsPanelProps) {
  const t = useTranslations('detailsPanel');
  const searchParams = useSearchParams();
  const detailsIndex = readDetailsIndexFromSearchParams(
    searchParams ?? new URLSearchParams()
  );
  const selectedListItem =
    detailsIndex != null ? results[detailsIndex - 1] : undefined;

  if (detailsIndex == null) {
    return null;
  }

  if (!selectedListItem) {
    return (
      <section className="item-details-panel" aria-label={t('ariaLabel')}>
        <header className="item-details-panel__header">
          <h2 className="item-details-panel__title">{t('title')}</h2>
          <button
            type="button"
            className="item-details-panel__close"
            onClick={closeDetails}
          >
            {t('close')}
          </button>
        </header>
        <p className="item-details-panel__error" role="alert">
          {t('itemUnavailable')}
        </p>
      </section>
    );
  }

  return (
    <section className="item-details-panel" aria-label={t('ariaLabel')}>
      <header className="item-details-panel__header">
        <h2 className="item-details-panel__title">{t('title')}</h2>
        <button
          type="button"
          className="item-details-panel__close"
          onClick={closeDetails}
        >
          {t('close')}
        </button>
      </header>

      <PokemonDetailsBody
        key={selectedListItem.name}
        pokemonName={selectedListItem.name}
      />
    </section>
  );
}
