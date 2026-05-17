import { useRouter } from "next/router";
import ProductDetailPanel from "@/src/components/product/ProductDetailPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductDetail } from "@/src/hooks/product/useProductDetail";

export default function ProductDetailPage() {
  const router = useRouter();
  const product = useProductDetail();
  const isReady = router.isReady;
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;

  return (
    <ProductWorkspaceLayout
      title={product.product?.title || (slug ? `Product ${slug}` : "Product Detail")}
      subtitle="View product information, manage images, and stay on top of reviews and customer questions."
      message={product.error}
    >
      {!isReady || product.isLoading || !product.product ? (
        <div className="theme-panel rounded-sm border p-8 text-sm theme-text-muted">
          Loading product detail...
        </div>
      ) : (
        <ProductDetailPanel
          product={product.product}
          activeVariation={product.activeVariation}
          attributes={product.attributes}
          shipZones={product.shipZones}
          shipExZones={product.shipExZones}
          variantMode={product.variantMode}
          onSelectVariation={product.selectVariation}
          onDeleteVariation={product.deleteVariation}
          reviewPreview={product.reviewPreview}
          reviewPreviewLoading={product.reviewPreviewLoading}
          reviewPreviewError={product.reviewPreviewError}
          onVoteReview={product.voteReview}
          questions={product.questions}
          questionsLoading={product.questionsLoading}
          questionsError={product.questionsError}
          questionDrafts={product.questionDrafts}
          onUpdateQuestionDraft={product.updateQuestionDraft}
          onSubmitAnswer={product.submitAnswer}
          onDeleteAnswer={product.deleteAnswer}
          onLoadMoreQuestions={product.loadMoreQuestions}
          hasMoreQuestions={product.hasMoreQuestions}
          imageActionLoadingId={product.imageActionLoadingId}
          onRemoveImage={product.removeImage}
          onMakeCoverImage={product.makeCoverImage}
        />
      )}
    </ProductWorkspaceLayout>
  );
}
