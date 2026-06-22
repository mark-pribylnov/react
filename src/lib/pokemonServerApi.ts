import { getCacheTtlSeconds, getPokeApiBaseUrl } from './cacheConfig';
import { HttpError, getHttpErrorMessage } from './httpError';
import { mapPokemonResponse } from './pokemonMappers';
import type {
  PokemonListResponse,
  PokemonResponse,
  PokemonResult,
} from '../types/pokemon';

const ITEMS_LIMIT = 32;
const SEARCH_LIST_LIMIT = 200;

async function fetchPokemonApi<T>(path: string): Promise<T> {
  const response = await fetch(`${getPokeApiBaseUrl()}${path}`, {
    next: { revalidate: getCacheTtlSeconds() },
  });

  if (!response.ok) {
    throw new HttpError(
      response.status,
      response.statusText,
      getHttpErrorMessage(response.status)
    );
  }

  return response.json() as Promise<T>;
}

async function fetchPokemonByName(name: string): Promise<PokemonResult | null> {
  const slug = name.trim().toLowerCase();
  if (!slug) {
    return null;
  }

  const data = await fetchPokemonApi<PokemonResponse>(
    `/pokemon/${encodeURIComponent(slug)}`
  );

  return mapPokemonResponse(data);
}

async function fetchFirstPagePokemon(): Promise<PokemonResult[]> {
  const listData = await fetchPokemonApi<PokemonListResponse>(
    `/pokemon?limit=${ITEMS_LIMIT}&offset=0`
  );
  const detailed = await Promise.all(
    listData.results.map((item) => fetchPokemonByName(item.name))
  );

  return detailed.filter((item): item is PokemonResult => item !== null);
}

async function fetchSearchResults(searchTerm: string): Promise<PokemonResult[]> {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  if (!normalizedTerm) {
    return [];
  }

  const params = new URLSearchParams({
    limit: String(SEARCH_LIST_LIMIT),
    offset: '0',
    search: normalizedTerm,
  });
  const listData = await fetchPokemonApi<PokemonListResponse>(
    `/pokemon?${params.toString()}`
  );
  const matches = listData.results.filter((item) =>
    item.name.includes(normalizedTerm)
  );
  const detailed = await Promise.all(
    matches.map((item) => fetchPokemonByName(item.name))
  );

  return detailed.filter((item): item is PokemonResult => item !== null);
}

export type PokemonListFetchResult = {
  results: PokemonResult[];
  errorMessage: string;
};

export type PokemonDetailFetchResult = {
  pokemon: PokemonResult | null;
  errorMessage: string;
};

export async function fetchPokemonDetailByName(
  name: string
): Promise<PokemonDetailFetchResult> {
  try {
    const pokemon = await fetchPokemonByName(name);

    if (!pokemon) {
      return {
        pokemon: null,
        errorMessage: 'Could not load details for this item.',
      };
    }

    return { pokemon, errorMessage: '' };
  } catch (error) {
    if (error instanceof HttpError) {
      return { pokemon: null, errorMessage: error.message };
    }

    return {
      pokemon: null,
      errorMessage: 'Could not load details for this item.',
    };
  }
}

export async function fetchPokemonListForPage(
  searchTerm: string
): Promise<PokemonListFetchResult> {
  try {
    const results = searchTerm
      ? await fetchSearchResults(searchTerm)
      : await fetchFirstPagePokemon();

    if (searchTerm && results.length === 0) {
      return {
        results,
        errorMessage: 'No results found for this search.',
      };
    }

    return { results, errorMessage: '' };
  } catch (error) {
    if (error instanceof HttpError) {
      return { results: [], errorMessage: error.message };
    }

    return {
      results: [],
      errorMessage: 'Could not load data. Please try again.',
    };
  }
}
