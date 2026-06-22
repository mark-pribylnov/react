'use server';

import { redirect } from 'next/navigation';
import { buildListSearchParams } from '../lib/searchParams';

export async function selectPokemonDetailsAction(formData: FormData): Promise<void> {
  const detailsIndexValue = formData.get('detailsIndex');
  const pageValue = formData.get('page');
  const searchValue = formData.get('search');

  const detailsIndex = Number(detailsIndexValue);
  const page = Number(pageValue);
  const search = typeof searchValue === 'string' ? searchValue.trim() : '';

  if (!Number.isFinite(detailsIndex) || detailsIndex < 1) {
    return;
  }

  if (!Number.isFinite(page) || page < 1) {
    return;
  }

  const query = buildListSearchParams({
    page,
    detailsIndex,
    search,
  });

  redirect(`/details${query}`);
}
