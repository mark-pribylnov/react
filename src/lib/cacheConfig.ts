const DEFAULT_CACHE_TTL_SECONDS = 60;

export function getCacheTtlSeconds(): number {
  const raw = import.meta.env.VITE_CACHE_TTL_SECONDS;
  if (raw === undefined || raw === '') {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_CACHE_TTL_SECONDS;
}

export function getPokeApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_POKEAPI_BASE_URL;
  return baseUrl && baseUrl.length > 0
    ? baseUrl
    : 'https://pokeapi.co/api/v2';
}
