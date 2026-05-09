import DashboardShell from "@/src/components/dashboard/DashboardShell";
import StoreReviewsPanel from "@/src/components/store/StoreReviewsPanel";
import { useStoreReviews } from "@/src/hooks/store/useStoreReviews";

export default function StoreReviewsPage() {
  const {
    reviews,
    hasNextPage,
    isLoading,
    isLoadingMore,
    message,
    loadMore,
    submitVote,
  } = useStoreReviews();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <StoreReviewsPanel
          reviews={reviews}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          message={message}
          onLoadMore={loadMore}
          onVote={submitVote}
        />
      </div>
    </DashboardShell>
  );
}
