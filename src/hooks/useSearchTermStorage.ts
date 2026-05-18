import { useCallback } from 'react';
import {
  getLastSearch,
  saveSearchTerm,
} from '../storage/searchTermStorage';

export function useSearchTermStorage() {
  const readSearchTerm = useCallback((): string => getLastSearch(), []);

  const persistSearchTerm = useCallback((term: string): void => {
    saveSearchTerm(term);
  }, []);

  return { readSearchTerm, persistSearchTerm };
}
