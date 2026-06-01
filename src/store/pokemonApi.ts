import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { QueryReturnValue } from '@reduxjs/toolkit/query';
import { getCacheTtlSeconds, getPokeApiBaseUrl } from '../lib/cacheConfig';
import { getHttpErrorMessage } from '../lib/httpError';
import { mapPokemonResponse } from '../lib/pokemonMappers';
import type {
  PokemonListResponse,
  PokemonResponse,
  PokemonResult,
} from '../types/pokemon';

const ITEMS_LIMIT = 32;
const SEARCH_LIST_LIMIT = 200;

export const pokemonTagTypes = ['PokemonList', 'PokemonDetail'] as const;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getPokeApiBaseUrl(),
});

const pokemonBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status =
      typeof result.error.status === 'number' ? result.error.status : 500;

    return {
      error: {
        status,
        data: getHttpErrorMessage(status),
      } satisfies FetchBaseQueryError,
    };
  }

  return result;
};

type PokemonEndpointBaseQuery = (
  arg: string | FetchArgs
) =>
  | QueryReturnValue<unknown, FetchBaseQueryError>
  | PromiseLike<QueryReturnValue<unknown, FetchBaseQueryError>>;

async function fetchPokemonResult(
  baseQuery: PokemonEndpointBaseQuery,
  name: string
): Promise<PokemonResult | null> {
  const slug = name.trim().toLowerCase();
  if (!slug) return null;

  const result = await baseQuery(`/pokemon/${encodeURIComponent(slug)}`);
  if (result.error) {
    throw new Error(String(result.error.data ?? 'Request failed'));
  }

  return mapPokemonResponse(result.data as PokemonResponse);
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: pokemonBaseQuery,
  tagTypes: [...pokemonTagTypes],
  keepUnusedDataFor: getCacheTtlSeconds(),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<PokemonResult | null, string>({
      async queryFn(name, _api, _extraOptions, baseQuery) {
        try {
          const data = await fetchPokemonResult(baseQuery, name);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Request failed',
            },
          };
        }
      },
      providesTags: (_result, _error, name) => {
        const id = name.trim().toLowerCase();
        return [
          { type: 'PokemonDetail', id },
          { type: 'PokemonDetail', id: 'DETAIL' },
        ];
      },
    }),
    getFirstPagePokemon: builder.query<PokemonResult[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const listResult = await baseQuery(
          `/pokemon?limit=${ITEMS_LIMIT}&offset=0`
        );
        if (listResult.error) {
          return { error: listResult.error };
        }

        const listData = listResult.data as PokemonListResponse;
        try {
          const detailed = await Promise.all(
            listData.results.map((item) => fetchPokemonResult(baseQuery, item.name))
          );
          return {
            data: detailed.filter((item): item is PokemonResult => item !== null),
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Request failed',
            },
          };
        }
      },
      providesTags: [
        { type: 'PokemonList', id: 'FIRST_PAGE' },
        { type: 'PokemonList', id: 'LIST' },
      ],
    }),
    getPokemonSearchResults: builder.query<PokemonResult[], string>({
      async queryFn(searchTerm, _api, _extraOptions, baseQuery) {
        const normalizedTerm = searchTerm.trim().toLowerCase();
        if (!normalizedTerm) {
          return { data: [] };
        }

        const params = new URLSearchParams({
          limit: String(SEARCH_LIST_LIMIT),
          offset: '0',
          search: normalizedTerm,
        });
        const listResult = await baseQuery(`/pokemon?${params.toString()}`);
        if (listResult.error) {
          return { error: listResult.error };
        }

        const listData = listResult.data as PokemonListResponse;
        const matches = listData.results.filter((item) =>
          item.name.includes(normalizedTerm)
        );

        try {
          const detailed = await Promise.all(
            matches.map((item) => fetchPokemonResult(baseQuery, item.name))
          );
          return {
            data: detailed.filter((item): item is PokemonResult => item !== null),
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Request failed',
            },
          };
        }
      },
      providesTags: (_result, _error, searchTerm) => [
        {
          type: 'PokemonList',
          id: `SEARCH_${searchTerm.trim().toLowerCase()}`,
        },
        { type: 'PokemonList', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPokemonByNameQuery,
  useGetFirstPagePokemonQuery,
  useGetPokemonSearchResultsQuery,
} = pokemonApi;

export function invalidateAllPokemonCache(
  dispatch: (action: ReturnType<typeof pokemonApi.util.invalidateTags>) => unknown
): void {
  dispatch(
    pokemonApi.util.invalidateTags([
      { type: 'PokemonList' },
      { type: 'PokemonDetail' },
    ])
  );
}
