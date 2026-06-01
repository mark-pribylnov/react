export function getFetchRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  if (input instanceof Request) {
    return input.url;
  }
  return String(input);
}

type MockFetchResponseOptions = {
  ok?: boolean;
  status?: number;
  statusText?: string;
};

function createResponseObject(
  bodyText: string,
  { ok, status, statusText }: Required<MockFetchResponseOptions>
) {
  const headers = new Headers({ 'content-type': 'application/json' });

  const response = {
    ok,
    status,
    statusText,
    headers,
    json: async () => JSON.parse(bodyText),
    text: async () => bodyText,
    clone() {
      return createResponseObject(bodyText, { ok, status, statusText });
    },
  };

  return response;
}

export function createMockFetchResponse(
  body: unknown,
  { ok = true, status = ok ? 200 : 500, statusText = ok ? 'OK' : 'Error' }: MockFetchResponseOptions = {}
): Response {
  const bodyText = typeof body === 'string' ? body : JSON.stringify(body);
  return createResponseObject(bodyText, { ok, status, statusText }) as Response;
}
