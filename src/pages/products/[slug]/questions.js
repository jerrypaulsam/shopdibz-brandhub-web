import ProductQuestionsPanel from "@/src/components/product/ProductQuestionsPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductQuestions } from "@/src/hooks/product/useProductQuestions";

export default function ProductQuestionsPage() {
  const productQuestions = useProductQuestions();

  return (
    <ProductWorkspaceLayout
      title="Product Questions"
      subtitle="Review customer questions, add answers, and keep product conversations up to date."
      message={productQuestions.message}
      aside={
        <div className="theme-panel theme-text-muted rounded-sm border p-5 text-sm leading-6">
          <p className="font-bold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
            Question Summary
          </p>
          <p className="mt-3">Product: {productQuestions.slug || "-"}</p>
          <p>Page: {String(productQuestions.page)}</p>
        </div>
      }
    >
      <ProductQuestionsPanel
        questions={productQuestions.questions}
        questionDrafts={productQuestions.questionDrafts}
        isLoading={productQuestions.isLoading}
        message={productQuestions.message}
        page={productQuestions.page}
        hasNextPage={productQuestions.hasNextPage}
        hasPreviousPage={productQuestions.hasPreviousPage}
        onUpdateRoute={productQuestions.updateRoute}
        onUpdateQuestionDraft={productQuestions.updateQuestionDraft}
        onSubmitAnswer={productQuestions.submitAnswer}
        onDeleteAnswer={productQuestions.deleteAnswer}
      />
    </ProductWorkspaceLayout>
  );
}
