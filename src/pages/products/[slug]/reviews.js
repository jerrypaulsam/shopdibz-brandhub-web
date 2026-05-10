import ProductReviewsPanel from "@/src/components/product/ProductReviewsPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductReviews } from "@/src/hooks/product/useProductReviews";

export default function ProductReviewsPage() {
  const reviews = useProductReviews();

  return (
    <ProductWorkspaceLayout
      title="Product Reviews"
      subtitle="Review moderation and sentiment reading for a single listing, kept on a direct slug route so teams can deep-link into exactly the right product."
      message={reviews.message}
      aside={
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5 text-sm leading-6 text-white/55">
          <p className="font-bold text-brand-white">Route State</p>
          <p className="mt-3">Slug: {reviews.slug || "-"}</p>
          <p>Page: {String(reviews.page)}</p>
        </div>
      }
    >
      <ProductReviewsPanel
        reviews={reviews.reviews}
        isLoading={reviews.isLoading}
        message={reviews.message}
        page={reviews.page}
        hasNextPage={reviews.hasNextPage}
        hasPreviousPage={reviews.hasPreviousPage}
        onUpdateRoute={reviews.updateRoute}
        onVote={reviews.submitVote}
      />
    </ProductWorkspaceLayout>
  );
}
