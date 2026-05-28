import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router';
import { delay } from '../../lib/delay';
import { getErrorMessage } from '../../lib/httpError';
import { readDetailsIndexFromSearchParams } from '../../lib/searchParams';
import { useGetPokemonByNameQuery } from '../../store';
import type { HomeOutletContext } from '../../types/homeOutletContext';
import './ItemDetailsPanel.scss';

const DETAILS_LOADING_DELAY_MS = 200;

type PokemonDetailsBodyProps = {
  pokemonName: string;
};

function PokemonDetailsBody({ pokemonName }: PokemonDetailsBodyProps) {
  const {
    data: pokemon,
    isFetching,
    isError,
    error,
  } = useGetPokemonByNameQuery(pokemonName);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void delay(DETAILS_LOADING_DELAY_MS).then(() => {
      if (!cancelled) {
        setShowLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = isFetching || showLoading;
  const errorMessage = isError
    ? getErrorMessage(error)
    : !isLoading && !pokemon
      ? 'Could not load details for this item.'
      : '';

  if (isLoading) {
    return (
      <div className="loading-indicator" role="status">
        <span className="loading-spinner" />
        Loading details...
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

export default function ItemDetailsPanel() {
  const { results, closeDetails } = useOutletContext<HomeOutletContext>();
  const [searchParams] = useSearchParams();
  const detailsIndex = readDetailsIndexFromSearchParams(searchParams);
  const selectedListItem =
    detailsIndex != null ? results[detailsIndex - 1] : undefined;

  if (detailsIndex == null) {
    return null;
  }

  if (!selectedListItem) {
    return (
      <section className="item-details-panel" aria-label="Item details">
        <header className="item-details-panel__header">
          <h2 className="item-details-panel__title">Details</h2>
          <button
            type="button"
            className="item-details-panel__close"
            onClick={closeDetails}
          >
            Close
          </button>
        </header>
        <p className="item-details-panel__error" role="alert">
          This item is not available in the current results.
        </p>
      </section>
    );
  }

  return (
    <section className="item-details-panel" aria-label="Item details">
      <header className="item-details-panel__header">
        <h2 className="item-details-panel__title">Details</h2>
        <button
          type="button"
          className="item-details-panel__close"
          onClick={closeDetails}
        >
          Close
        </button>
      </header>

      <PokemonDetailsBody
        key={selectedListItem.name}
        pokemonName={selectedListItem.name}
      />
    </section>
  );
}
