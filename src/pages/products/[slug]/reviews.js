import ProductReviewsPanel from "@/src/components/product/ProductReviewsPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductReviews } from "@/src/hooks/product/useProductReviews";

export default function ProductReviewsPage() {
  const reviews = useProductReviews();

  return (
    <ProductWorkspaceLayout
      title="Product Reviews"
      subtitle="Read customer feedback, track sentiment, and respond to what shoppers are saying about this product."
      message={reviews.message}
      aside={
        <div className="theme-panel theme-text-muted rounded-sm border p-5 text-sm leading-6">
          <p className="font-bold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
            Review Summary
          </p>
          <p className="mt-3">Product: {reviews.slug || "-"}</p>
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
