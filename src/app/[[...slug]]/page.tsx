import { ClientOnly } from './client';

export function generateStaticParams() {
  return [{ slug: ['about'] }, { slug: ['details'] }];
}

export default function Page() {
  return <ClientOnly />;
}
