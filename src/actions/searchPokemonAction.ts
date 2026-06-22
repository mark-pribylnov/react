'use server';

import { redirect } from 'next/navigation';
import { buildListSearchParams } from '../lib/searchParams';

export type SearchActionState = {
  error: string | null;
};

export async function searchPokemonAction(
  _prevState: SearchActionState,
  formData: FormData
): Promise<SearchActionState> {
  const searchValue = formData.get('searchQuery');
  const currentSearchValue = formData.get('currentSearch');

  if (typeof searchValue !== 'string') {
    return { error: 'Invalid search request.' };
  }

  const term = searchValue.trim();
  const currentSearch =
    typeof currentSearchValue === 'string' ? currentSearchValue.trim() : '';

  if (term === currentSearch) {
    return { error: null };
  }

  const search = buildListSearchParams({
    page: 1,
    detailsIndex: null,
    search: term,
  });

  redirect(`/${search}`);
}
