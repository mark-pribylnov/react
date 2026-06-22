'use client';

import { useTranslations } from 'next-intl';
import { localizeErrorMessage as localizeErrorMessageText } from '../lib/localizeErrorMessage';

export function useLocalizedErrorMessage(message: string): string {
  const t = useTranslations('errors');
  return localizeErrorMessageText(message, t);
}
