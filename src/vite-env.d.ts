/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CACHE_TTL_SECONDS?: string;
  readonly VITE_POKEAPI_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
