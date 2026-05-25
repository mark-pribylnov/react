import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router';
import { delay } from '../../lib/delay';
import { getErrorMessage } from '../../lib/httpError';
import { readDetailsIndexFromSearchParams } from '../../lib/searchParams';
import type { HomeOutletContext } from '../../types/homeOutletContext';
import type { PokemonResult } from '../../types/pokemon';
import './ItemDetailsPanel.scss';

const DETAILS_LOADING_DELAY_MS = 200;

type DetailsState = {
  pokemon: PokemonResult | null;
  isLoading: boolean;
  errorMessage: string;
};

const initialDetailsState: DetailsState = {
  pokemon: null,
  isLoading: true,
  errorMessage: '',
};

export default function ItemDetailsPanel() {
  const { results, fetchPokemonDetails, closeDetails } =
    useOutletContext<HomeOutletContext>();
  const [searchParams] = useSearchParams();
  const detailsIndex = readDetailsIndexFromSearchParams(searchParams);
  const selectedListItem =
    detailsIndex != null ? results[detailsIndex - 1] : undefined;

  const [state, setState] = useState<DetailsState>(initialDetailsState);

  useEffect(() => {
    if (!selectedListItem) {
      return;
    }

    let cancelled = false;

    const loadDetails = async (): Promise<void> => {
      setState({ pokemon: null, isLoading: true, errorMessage: '' });

      try {
        await delay(DETAILS_LOADING_DELAY_MS);
        const pokemon = await fetchPokemonDetails(selectedListItem.name);
        if (cancelled) return;

        if (!pokemon) {
          setState({
            pokemon: null,
            isLoading: false,
            errorMessage: 'Could not load details for this item.',
          });
          return;
        }

        setState({ pokemon, isLoading: false, errorMessage: '' });
      } catch (error) {
        if (cancelled) return;
        setState({
          pokemon: null,
          isLoading: false,
          errorMessage: getErrorMessage(error),
        });
      }
    };

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [detailsIndex, selectedListItem?.name, fetchPokemonDetails]);

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

  const { pokemon, isLoading, errorMessage } = state;

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

      {isLoading ? (
        <div className="loading-indicator" role="status">
          <span className="loading-spinner" />
          Loading details...
        </div>
      ) : errorMessage ? (
        <p className="item-details-panel__error" role="alert">
          {errorMessage}
        </p>
      ) : pokemon ? (
        <article className="item-details-panel__content">
          <h3 className="item-details-panel__name">{pokemon.name}</h3>
          <ul className="item-details-panel__stats">
            {pokemon.stats.map((stat) => (
              <li key={stat}>{stat}</li>
            ))}
          </ul>
        </article>
      ) : null}
    </section>
  );
}
