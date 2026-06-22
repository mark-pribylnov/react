import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
