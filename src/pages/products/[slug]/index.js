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
      subtitle="A direct-linkable product workspace keyed by slug, with modern sections for media, pricing, catalog metadata, and variation operations."
      message={product.error}
      aside={
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5 text-sm leading-6 text-white/55">
          <p className="font-bold text-brand-white">Route State</p>
          <p className="mt-3">Slug: {product.product?.slug || slug || "-"}</p>
          <p>Variant mode: {product.variantMode}</p>
          <p>
            Variation id: {product.activeVariation?.id ? String(product.activeVariation.id) : "-"}
          </p>
        </div>
      }
    >
      {!isReady || product.isLoading || !product.product ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
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
