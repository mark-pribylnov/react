import AppLayout from '../../layouts/AppLayout';

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
