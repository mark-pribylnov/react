const DEFAULT_CACHE_TTL_SECONDS = 60;

export function getCacheTtlSeconds(): number {
  const parsed = Number(import.meta.env.VITE_CACHE_TTL_SECONDS);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_CACHE_TTL_SECONDS;
}

export function getPokeApiBaseUrl(): string {
  return (
    import.meta.env.VITE_POKEAPI_BASE_URL ?? 'https://pokeapi.co/api/v2'
  );
}
