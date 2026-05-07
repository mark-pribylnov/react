import { describe, expect, it } from 'vitest';
import { HttpError, getErrorMessage, getHttpErrorMessage } from './httpError';

describe('getHttpErrorMessage', () => {
  it('returns not-found message for 404', () => {
    expect(getHttpErrorMessage(404)).toContain('No results found');
  });

  it('returns server error message for 5xx', () => {
    expect(getHttpErrorMessage(500)).toContain('Server error');
    expect(getHttpErrorMessage(503)).toContain('Server error');
  });

  it('returns client error message for other 4xx', () => {
    expect(getHttpErrorMessage(400)).toContain('Request error');
    expect(getHttpErrorMessage(418)).toContain('Request error');
  });

  it('returns generic message for non-4xx/5xx', () => {
    expect(getHttpErrorMessage(302)).toContain('Could not load data');
  });
});

describe('getErrorMessage', () => {
  it('returns HttpError message', () => {
    const err = new HttpError(404, 'Not Found', 'custom');
    expect(getErrorMessage(err)).toBe('custom');
  });

  it('returns network message for generic Error', () => {
    expect(getErrorMessage(new Error('fail'))).toContain('Network error');
  });

  it('returns generic message for unknown values', () => {
    expect(getErrorMessage('oops')).toContain('Could not load data');
  });
});
