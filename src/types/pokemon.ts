export type PokemonStat = {
  base_stat: number;
  stat: { name: string };
};

export type PokemonResponse = {
  name: string;
  stats: PokemonStat[];
};

export type PokemonListItem = {
  name: string;
};

export type PokemonListResponse = {
  results: PokemonListItem[];
};

export type PokemonResult = {
  name: string;
  stats: string[];
};
