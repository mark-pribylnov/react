import type { PokemonResult } from './pokemon';

export type HomeOutletContext = {
  results: PokemonResult[];
  closeDetails: () => void;
};
