import PokemonImage from '../../components/PokemonImage/PokemonImage';
import type { PokemonResult } from '../../types/pokemon';
import '../../components/ItemDetailsPanel/ItemDetailsPanel.scss';

type ItemDetailsPanelContentProps = {
  pokemon: PokemonResult | null;
  errorMessage: string;
  imageAltLabel: string;
};

export function ItemDetailsPanelContent({
  pokemon,
  errorMessage,
  imageAltLabel,
}: ItemDetailsPanelContentProps) {
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
          alt={imageAltLabel}
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
