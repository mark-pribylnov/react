import { useMemo, memo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

const ROW_HEIGHT_BASE = 150;
const ROW_HEIGHT_PER_COLUMN = 36;
const LIST_HEIGHT = 600;

type CountryRowProps = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const CountryRow = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<CountryRowProps>) => (
  <div className={styles.row} style={style}>
    <div className={styles.cardWrapper}>
      <CountryCard
        country={countries[index]}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  </div>
);

const getRowHeight = (_index: number, rowProps: CountryRowProps) =>
  ROW_HEIGHT_BASE + rowProps.selectedColumns.length * ROW_HEIGHT_PER_COLUMN;

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = memo(({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(
    () =>
      countries
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          } else {
            const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
            const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
            return sortOrder === 'asc' ? popA - popB : popB - popA;
          }
        }),
    [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]
  );

  const rowProps = useMemo(
    () => ({
      countries: filteredCountries,
      selectedYear,
      selectedColumns,
    }),
    [filteredCountries, selectedYear, selectedColumns]
  );

  return (
    <List
      className={styles.countryList}
      rowComponent={CountryRow}
      rowCount={filteredCountries.length}
      rowHeight={getRowHeight}
      rowProps={rowProps}
      style={{ height: LIST_HEIGHT, width: '100%' }}
    />
  );
});
