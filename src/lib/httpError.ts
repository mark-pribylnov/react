export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

export function getHttpErrorMessage(status: number): string {
  if (status === 404) {
    return 'No results found for this search.';
  }
  if (status >= 500) {
    return 'Server error. Please try again in a moment.';
  }
  if (status >= 400) {
    return 'Request error. Please check your search and try again.';
  }
  return 'Could not load data. Please try again.';
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as { data: unknown }).data === 'string'
  ) {
    return (error as { data: string }).data;
  }
  if (error instanceof Error) {
    return 'Network error. Please check your connection and try again.';
  }
  return 'Could not load data. Please try again.';
}
