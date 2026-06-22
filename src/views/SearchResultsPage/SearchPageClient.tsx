'use client';

import {
  useActionState,
  useEffect,
  type ChangeEvent,
} from 'react';
import { useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import {
  searchPokemonAction,
  type SearchActionState,
} from '../../actions/searchPokemonAction';
import { SearchPanel } from '../../components/SearchPanel/SearchPanel';
import { useSearchTermStorage } from '../../hooks/useSearchTermStorage';
import { readSearchFromSearchParams } from '../../lib/searchParams';
import {
  invalidateAllPokemonCache,
  setLastExecutedSearch,
  setSearchQuery,
  setShouldSimulateCrash,
  useAppDispatch,
  useAppSelector,
} from '../../store';

const initialSearchState: SearchActionState = {
  error: null,
};

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
  const [searchState, searchAction, isSearchPending] = useActionState(
    searchPokemonAction,
    initialSearchState
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

  const handleBeforeSubmit = (): void => {
    const term = searchQuery.trim();
    persistSearchTerm(term);
    dispatch(setLastExecutedSearch(term));
  };

  if (shouldSimulateCrash) {
    throw new Error('Test error button triggered application crash.');
  }

  return (
    <>
      {searchState.error ? (
        <p className="search-section__error" role="alert">
          {searchState.error}
        </p>
      ) : null}
      <SearchPanel
        searchQuery={searchQuery}
        currentSearch={lastExecutedSearch ?? ''}
        onQueryChange={onQueryChange}
        formAction={searchAction}
        onBeforeSubmit={handleBeforeSubmit}
        isSearchPending={isSearchPending}
        onRefresh={handleRefresh}
        onSimulateError={simulateAppError}
      />
    </>
  );
}
