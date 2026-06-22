'use client';

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  type ChangeEvent,
} from 'react';
import { usePathname, useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import type { SearchActionState } from '../../actions/searchPokemonAction';
import { AppErrorBoundary } from '../../components/AppErrorBoundary/AppErrorBoundary';
import ItemDetailsPanel from '../../components/ItemDetailsPanel/ItemDetailsPanel';
import MasterDetailLayout from '../../components/MasterDetailLayout/MasterDetailLayout';
import ResultsPanel from '../../components/ResultsPanel/ResultsPanel';
import { SearchPanel } from '../../components/SearchPanel/SearchPanel';
import { usePokemonListQuery } from '../../hooks/usePokemonListQuery';
import { useSearchTermStorage } from '../../hooks/useSearchTermStorage';
import {
  buildListSearchParams,
  readDetailsIndexFromSearchParams,
  readPageFromSearchParams,
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
import type { HomeOutletContext } from '../../types/homeOutletContext';
import '../../App.css';

function SearchPageInteractiveContent() {
  const dispatch = useAppDispatch();
  const { searchQuery, lastExecutedSearch, shouldSimulateCrash } =
    useAppSelector((state) => state.search);
  const { results, isLoading, errorMessage } =
    usePokemonListQuery(lastExecutedSearch);

  const { readSearchTerm, persistSearchTerm } = useSearchTermStorage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDetailsOpen = pathname === '/details';
  const currentPage = readPageFromSearchParams(
    searchParams ?? new URLSearchParams()
  );
  const selectedDetailsIndex = readDetailsIndexFromSearchParams(
    searchParams ?? new URLSearchParams()
  );
  const urlSearchTerm = readSearchFromSearchParams(
    searchParams ?? new URLSearchParams()
  );

  const navigateWithListParams = useCallback(
    (options: {
      page: number;
      detailsIndex?: number | null;
      openDetails?: boolean;
      search?: string | null;
    }) => {
      const params = searchParams ?? new URLSearchParams();
      const search = buildListSearchParams({
        page: options.page,
        detailsIndex: options.openDetails
          ? (options.detailsIndex ?? null)
          : null,
        search:
          options.search ??
          lastExecutedSearch ??
          readSearchFromSearchParams(params),
      });
      const nextPath = options.openDetails ? '/details' : '/';
      router.push(`${nextPath}${search}`);
    },
    [lastExecutedSearch, router, searchParams]
  );

  const setCurrentPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const nextPage =
        typeof updater === 'function' ? updater(currentPage) : updater;

      navigateWithListParams({
        page: nextPage,
        detailsIndex: selectedDetailsIndex,
        openDetails: isDetailsOpen,
      });
    },
    [currentPage, isDetailsOpen, navigateWithListParams, selectedDetailsIndex]
  );

  const openItemDetails = useCallback(
    (itemIndex: number) => {
      navigateWithListParams({
        page: currentPage,
        detailsIndex: itemIndex,
        openDetails: true,
      });
    },
    [currentPage, navigateWithListParams]
  );

  const closeItemDetails = useCallback(() => {
    navigateWithListParams({
      page: currentPage,
      detailsIndex: null,
      openDetails: false,
    });
  }, [currentPage, navigateWithListParams]);

  const outletContext = useMemo<HomeOutletContext>(
    () => ({
      results,
      closeDetails: closeItemDetails,
    }),
    [closeItemDetails, results]
  );

  useEffect(() => {
    const storedTerm = readSearchTerm().trim();
    const nextTerm = urlSearchTerm || storedTerm;
    dispatch(setSearchQuery(nextTerm));
    dispatch(setLastExecutedSearch(nextTerm));
  }, [dispatch, readSearchTerm, urlSearchTerm]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSearchQuery(event.target.value));
  };

  const simulateAppError = (): void => {
    dispatch(setShouldSimulateCrash(true));
  };

  const handleRefresh = (): void => {
    invalidateAllPokemonCache(dispatch);
  };

  const interactiveSearchAction = useCallback(
    async (
      _prevState: SearchActionState,
      formData: FormData
    ): Promise<SearchActionState> => {
      const term = String(formData.get('searchQuery') ?? '').trim();
      const currentSearch = String(formData.get('currentSearch') ?? '').trim();

      if (term === currentSearch) {
        if (term !== searchQuery.trim()) {
          dispatch(normalizeSearchQuery());
        }
        return { error: null };
      }

      persistSearchTerm(term);
      dispatch(setLastExecutedSearch(term));
      navigateWithListParams({
        page: 1,
        detailsIndex: null,
        openDetails: false,
        search: term,
      });

      return { error: null };
    },
    [dispatch, navigateWithListParams, persistSearchTerm, searchQuery]
  );

  const [, searchAction] = useActionState(interactiveSearchAction, {
    error: null,
  });

  const handleBeforeSubmit = (): void => {
    persistSearchTerm(searchQuery.trim());
    dispatch(setLastExecutedSearch(searchQuery.trim()));
  };

  const handleListPanelClick = (): void => {
    if (isDetailsOpen) {
      closeItemDetails();
    }
  };

  if (shouldSimulateCrash) {
    throw new Error('Test error button triggered application crash.');
  }

  return (
    <>
      <SearchPanel
        searchQuery={searchQuery}
        currentSearch={lastExecutedSearch ?? ''}
        onQueryChange={onQueryChange}
        formAction={searchAction}
        onBeforeSubmit={handleBeforeSubmit}
        onRefresh={handleRefresh}
        onSimulateError={simulateAppError}
      />
      <MasterDetailLayout
        isDetailsOpen={isDetailsOpen}
        onListPanelClick={handleListPanelClick}
        detailsPanel={
          isDetailsOpen ? (
            <ItemDetailsPanel
              results={outletContext.results}
              closeDetails={outletContext.closeDetails}
            />
          ) : null
        }
      >
        <ResultsPanel
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          errorMessage={errorMessage}
          results={results}
          selectedDetailsIndex={selectedDetailsIndex}
          onSelectItem={openItemDetails}
        />
      </MasterDetailLayout>
    </>
  );
}

export default function SearchPageInteractive() {
  return (
    <AppErrorBoundary>
      <SearchPageInteractiveContent />
    </AppErrorBoundary>
  );
}
