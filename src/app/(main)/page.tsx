import { SearchResultsPage } from '../../views/SearchResultsPage/SearchResultsPage';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <SearchResultsPage
      isDetailsOpen={false}
      searchParams={await searchParams}
    />
  );
}
