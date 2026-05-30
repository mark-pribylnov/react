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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (isRecord(error)) {
    if (typeof error.data === 'string' && error.data.length > 0) {
      return error.data;
    }

    if (error.status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection and try again.';
    }

    if (error.status === 'TIMEOUT_ERROR') {
      return 'The request timed out. Please try again.';
    }

    if (typeof error.error === 'string' && error.error.length > 0) {
      return error.error;
    }

    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message || 'Network error. Please check your connection and try again.';
  }

  return 'Could not load data. Please try again.';
}
