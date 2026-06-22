const ERROR_MESSAGE_KEYS: Record<string, string> = {
  'No results found for this search.': 'noResults',
  'Server error. Please try again in a moment.': 'serverError',
  'Request error. Please check your search and try again.': 'requestError',
  'Could not load data. Please try again.': 'loadFailed',
  'Could not load details for this item.': 'loadFailed',
  'Network error. Please check your connection and try again.': 'networkError',
  'The request timed out. Please try again.': 'timeoutError',
};

export function localizeErrorMessage(
  message: string,
  translate: (key: string) => string
): string {
  if (!message) {
    return '';
  }

  const key = ERROR_MESSAGE_KEYS[message];
  return key ? translate(key) : message;
}
