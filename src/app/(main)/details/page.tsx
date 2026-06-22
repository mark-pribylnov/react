import { SearchResultsPage } from '../../../views/SearchResultsPage/SearchResultsPage';

type DetailsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DetailsPage({ searchParams }: DetailsPageProps) {
  return (
    <SearchResultsPage
      isDetailsOpen
      searchParams={await searchParams}
    />
  );
}
