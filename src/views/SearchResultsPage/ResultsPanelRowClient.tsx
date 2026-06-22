'use client';

import type { ChangeEvent, MouseEvent, TransitionStartFunction } from 'react';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { selectPokemonDetailsAction } from '../../actions/selectPokemonDetailsAction';
import {
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
};

export function ResultsPanelRowClient({
  result,
  itemIndex,
  selectedDetailsIndex,
}: ResultsPanelRowClientProps) {
  const t = useTranslations('resultsPanel');
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [isSelecting, startTransition] = useTransition();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const itemKey = getPokemonItemKey(result);
  const isChecked = selectedItems.some(
    (item) => getPokemonItemKey(item.pokemon) === itemKey
  );
  const isDetailsOpen = selectedDetailsIndex === itemIndex;
  const rowClassName = [
    isChecked ? 'results-row-checked' : '',
    isDetailsOpen ? 'results-row-details-open' : '',
    isSelecting ? 'results-row-selecting' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const submitDetailsSelection = (
    startTransitionFn: TransitionStartFunction
  ): void => {
    const params = searchParams ?? new URLSearchParams();
    const formData = new FormData();
    formData.set('detailsIndex', String(itemIndex));
    formData.set('page', String(readPageFromSearchParams(params)));
    formData.set('search', readSearchFromSearchParams(params));

    startTransitionFn(() => {
      void selectPokemonDetailsAction(formData);
    });
  };

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>): void => {
    event.stopPropagation();
    submitDetailsSelection(startTransition);
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
          aria-label={t('selectItem', { name: result.name })}
          onChange={handleCheckboxChange}
          onClick={(event) => event.stopPropagation()}
        />
      </td>
      <td>
        <div className="results-table__name-cell">
          {result.imageUrl ? (
            <PokemonImage
              src={result.imageUrl}
              alt={t('imageAlt', { name: result.name })}
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
