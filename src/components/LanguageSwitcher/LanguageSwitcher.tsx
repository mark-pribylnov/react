'use client';

import { useLocale, useTranslations } from 'next-intl';
import { locales, type AppLocale } from '../../i18n/config';
import { useSwitchLocale } from '../../context/useSwitchLocale';
import './LanguageSwitcher.scss';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const switchLocale = useSwitchLocale();
  const t = useTranslations('language');

  return (
    <div className="language-switcher" role="group" aria-label={t('ariaLabel')}>
      {locales.map((option) => (
        <label key={option} className="language-switcher__option">
          <input
            type="radio"
            name="app-language"
            value={option}
            checked={locale === option}
            onChange={() => switchLocale(option as AppLocale)}
          />
          <span>{t(option)}</span>
        </label>
      ))}
    </div>
  );
}
