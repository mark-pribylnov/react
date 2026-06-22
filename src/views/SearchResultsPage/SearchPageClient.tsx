'use client';

import {
  useCallback,
  useEffect,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { SearchPanel } from '../../components/SearchPanel/SearchPanel';
import { useSearchTermStorage } from '../../hooks/useSearchTermStorage';
import {
  buildListSearchParams,
  readSearchFromSearchParams,
} from '../../lib/searchParams';
import {
  invalidateAllPokemonCache,
  normalizeSearchQuery,
  setLastExecutedSearch,
  setSearchQuery,
  setShouldSimulateCrash,
  useAppDispatch,
  useAppSelector,
} from '../../store';

type SearchPageClientProps = {
  initialSearchTerm: string;
};

export function SearchPageClient({ initialSearchTerm }: SearchPageClientProps) {
  const dispatch = useAppDispatch();
  const { searchQuery, lastExecutedSearch, shouldSimulateCrash } =
    useAppSelector((state) => state.search);
  const { readSearchTerm, persistSearchTerm } = useSearchTermStorage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchTerm = readSearchFromSearchParams(
    searchParams ?? new URLSearchParams()
  );

  useEffect(() => {
    const storedTerm = readSearchTerm().trim();
    const nextTerm = urlSearchTerm || storedTerm || initialSearchTerm;
    dispatch(setSearchQuery(nextTerm));
    dispatch(setLastExecutedSearch(nextTerm));
  }, [dispatch, initialSearchTerm, readSearchTerm, urlSearchTerm]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSearchQuery(event.target.value));
  };

  const simulateAppError = (): void => {
    dispatch(setShouldSimulateCrash(true));
  };

  const handleRefresh = (): void => {
    invalidateAllPokemonCache(dispatch);
    router.refresh();
  };

  const onSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const term = searchQuery.trim();
      if (term === lastExecutedSearch) {
        if (term !== searchQuery) {
          dispatch(normalizeSearchQuery());
        }
        return;
      }

      persistSearchTerm(term);
      dispatch(setLastExecutedSearch(term));
      const search = buildListSearchParams({
        page: 1,
        detailsIndex: null,
        search: term,
      });
      router.push(`/${search}`);
    },
    [dispatch, lastExecutedSearch, persistSearchTerm, router, searchQuery]
  );

  if (shouldSimulateCrash) {
    throw new Error('Test error button triggered application crash.');
  }

  return (
    <SearchPanel
      searchQuery={searchQuery}
      onQueryChange={onQueryChange}
      onSubmit={onSubmit}
      onRefresh={handleRefresh}
      onSimulateError={simulateAppError}
    />
  );
}
