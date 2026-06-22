'use client';

import type { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';
import {
  buildListSearchParams,
  readPageFromSearchParams,
  readSearchFromSearchParams,
} from '../../lib/searchParams';
import { getPokemonItemKey } from '../../lib/pokemonItemKey';
import type { PokemonResult } from '../../types/pokemon';
import PokemonImage from '../../components/PokemonImage/PokemonImage';
import { toggleSelectedItem, useAppDispatch, useAppSelector } from '../../store';

type ResultsPanelRowClientProps = {
  result: PokemonResult;
  itemIndex: number;
  selectedDetailsIndex: number | null;
  imageAltLabel: string;
  selectItemLabel: string;
};

export function ResultsPanelRowClient({
  result,
  itemIndex,
  selectedDetailsIndex,
  imageAltLabel,
  selectItemLabel,
}: ResultsPanelRowClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const itemKey = getPokemonItemKey(result);
  const isChecked = selectedItems.some(
    (item) => getPokemonItemKey(item.pokemon) === itemKey
  );
  const isDetailsOpen = selectedDetailsIndex === itemIndex;
  const rowClassName = [
    isChecked ? 'results-row-checked' : '',
    isDetailsOpen ? 'results-row-details-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>): void => {
    event.stopPropagation();
    const params = searchParams ?? new URLSearchParams();
    const search = buildListSearchParams({
      page: readPageFromSearchParams(params),
      detailsIndex: itemIndex,
      search: readSearchFromSearchParams(params),
    });
    router.push(`/details${search}`);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    dispatch(toggleSelectedItem({ pokemon: result, listIndex: itemIndex }));
  };

  return (
    <tr
      className={rowClassName || undefined}
      onClick={handleRowClick}
    >
      <td className="results-table__select-cell">
        <input
          type="checkbox"
          checked={isChecked}
          aria-label={selectItemLabel}
          onChange={handleCheckboxChange}
          onClick={(event) => event.stopPropagation()}
        />
      </td>
      <td>
        <div className="results-table__name-cell">
          {result.imageUrl ? (
            <PokemonImage
              src={result.imageUrl}
              alt={imageAltLabel}
              width={32}
              height={32}
              className="results-table__pokemon-image"
            />
          ) : null}
          <span>{`${itemIndex}) ${result.name}`}</span>
        </div>
      </td>
      <td>
        <ul>
          {result.stats.map((stat) => (
            <li key={stat}>{stat}</li>
          ))}
        </ul>
      </td>
    </tr>
  );
}
