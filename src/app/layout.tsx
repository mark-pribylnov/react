import type { Metadata } from 'next';
import '../index.css';
import { AppProviders } from './AppProviders';

export const metadata: Metadata = {
  title: 'rs-react-app',
  description: 'RS School React course project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
