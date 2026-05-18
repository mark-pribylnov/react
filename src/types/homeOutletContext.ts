import type { PokemonResult } from './pokemon';

export type HomeOutletContext = {
  results: PokemonResult[];
  fetchPokemonDetails: (name: string) => Promise<PokemonResult | null>;
  closeDetails: () => void;
};
