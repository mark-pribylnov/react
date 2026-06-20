import { ClientOnly } from './client';

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ['details'] }];
}

export default function Page() {
  return <ClientOnly />;
}
