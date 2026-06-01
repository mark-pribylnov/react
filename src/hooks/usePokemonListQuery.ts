import { useMemo } from 'react';
import { getErrorMessage } from '../lib/httpError';
import {
  useGetFirstPagePokemonQuery,
  useGetPokemonSearchResultsQuery,
} from '../store';
import type { PokemonResult } from '../types/pokemon';

export function usePokemonListQuery(lastExecutedSearch: string | null) {
  const isReady = lastExecutedSearch !== null;
  const hasSearchTerm = Boolean(lastExecutedSearch);

  const firstPageQuery = useGetFirstPagePokemonQuery(undefined, {
    skip: !isReady || hasSearchTerm,
  });
  const searchResultsQuery = useGetPokemonSearchResultsQuery(
    lastExecutedSearch ?? '',
    {
      skip: !isReady || !hasSearchTerm,
    }
  );

  const activeQuery = hasSearchTerm ? searchResultsQuery : firstPageQuery;
  const results = (activeQuery.data ?? []) as PokemonResult[];
  const isLoading =
    activeQuery.isLoading || (activeQuery.isFetching && !activeQuery.data);

  const errorMessage = useMemo(() => {
    if (activeQuery.isError) {
      return getErrorMessage(activeQuery.error);
    }
    if (hasSearchTerm && !isLoading && results.length === 0) {
      return 'No results found for this search.';
    }
    return '';
  }, [
    activeQuery.error,
    activeQuery.isError,
    hasSearchTerm,
    isLoading,
    results.length,
  ]);

  return { results, isLoading, errorMessage };
}
