import { ManagerDetailRoute } from "@/features/manager-detail/routes/manager-detail-route";

type ManagerDetailPageProps = {
  searchParams: Promise<{
    manager?: string;
    tab?: string;
  }>;
};

export default async function ManagerDetailPage({
  searchParams,
}: ManagerDetailPageProps) {
  const params = await searchParams;

  return (
    <ManagerDetailRoute
      initialManager={params.manager ?? null}
      initialTab={params.tab ?? null}
    />
  );
}