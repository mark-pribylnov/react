'use client';

import dynamic from 'next/dynamic';

const AppRouter = dynamic(() => import('../../AppRouter'), { ssr: false });

export function ClientOnly() {
  return <AppRouter />;
}
