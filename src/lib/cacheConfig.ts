const DEFAULT_CACHE_TTL_SECONDS = 60;

export function getCacheTtlSeconds(): number {
  const raw = process.env.NEXT_PUBLIC_CACHE_TTL_SECONDS;
  if (raw === undefined || raw === '') {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_CACHE_TTL_SECONDS;
}

export function getPokeApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_POKEAPI_BASE_URL;
  return baseUrl && baseUrl.length > 0
    ? baseUrl
    : 'https://pokeapi.co/api/v2';
}
