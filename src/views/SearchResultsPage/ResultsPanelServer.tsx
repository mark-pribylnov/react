import type { PokemonResult } from '../../types/pokemon';
import { ResultsPanelViewClient } from './ResultsPanelViewClient';

type ResultsPanelServerProps = {
  results: PokemonResult[];
  currentPage: number;
  errorMessage: string;
  selectedDetailsIndex: number | null;
};

export function ResultsPanelServer(props: ResultsPanelServerProps) {
  return <ResultsPanelViewClient {...props} />;
}
