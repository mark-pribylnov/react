import { HttpError, getHttpErrorMessage } from '../lib/httpError';
import type {
  PokemonListResponse,
  PokemonResponse,
  PokemonResult,
} from '../types/pokemon';

const ITEMS_LIMIT = 32;

export class PokemonApi {
  private async requestJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new HttpError(
        response.status,
        response.statusText,
        getHttpErrorMessage(response.status)
      );
    }
    return (await response.json()) as T;
  }

  async fetchOnePokemon(query: string): Promise<PokemonResult | null> {
    const slug = query.trim().toLowerCase();
    if (!slug) return null;

    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(slug)}`;
    const pokemonData = await this.requestJson<PokemonResponse>(url);
    return {
      name: pokemonData.name,
      stats: pokemonData.stats.map(
        (stat) => `${stat.stat.name} - ${stat.base_stat}`
      ),
    };
  }

  async fetchFirstPagePokemon(): Promise<PokemonResult[]> {
    const listData = await this.requestJson<PokemonListResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_LIMIT}&offset=0`
    );
    const detailed = await Promise.all(
      listData.results.map((item) => this.fetchOnePokemon(item.name))
    );
    return detailed.filter((item): item is PokemonResult => item !== null);
  }

  async fetchPokemonSearchResults(
    searchTerm: string
  ): Promise<PokemonResult[]> {
    const normalizedTerm = searchTerm.toLowerCase();
    const params = new URLSearchParams({
      limit: '200',
      offset: '0',
      search: normalizedTerm,
    });

    const listData = await this.requestJson<PokemonListResponse>(
      `https://pokeapi.co/api/v2/pokemon?${params.toString()}`
    );
    const matches = listData.results.filter((item) =>
      item.name.includes(normalizedTerm)
    );

    const detailed = await Promise.all(
      matches.map((item) => this.fetchOnePokemon(item.name))
    );
    const results = detailed.filter(
      (item): item is PokemonResult => item !== null
    );
    console.log(results);
    return results;
  }
}
