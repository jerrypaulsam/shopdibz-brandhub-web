import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  createProductAnswer,
  deleteExistingVariation,
  deleteProductAnswer,
  fetchProductDetail,
  fetchProductQuestions,
  fetchProductReviews,
  makeExistingProductCoverImage,
  removeExistingProductImage,
  voteProductReview,
} from "@/src/api/products";
import {
  normalizePaginatedCollection,
  parseProductAttributes,
  parsePseudoArray,
  resolveActiveVariation,
} from "@/src/utils/product";

/**
 * @returns {{
 * product: any,
 * activeVariation: any,
 * isLoading: boolean,
 * error: string,
 * refresh: () => Promise<void>,
 * selectVariation: (variationId: number) => Promise<void>,
 * deleteVariation: (variationId: number) => Promise<void>,
 * shipZones: string[],
 * shipExZones: string[],
 * attributes: Record<string, string[]>,
 * reviewPreview: any[],
 * reviewPreviewLoading: boolean,
 * reviewPreviewError: string,
 * voteReview: (reviewId: number, vote: string) => Promise<void>,
 * questions: any[],
 * questionsLoading: boolean,
 * questionsError: string,
 * questionDrafts: Record<string, string>,
 * updateQuestionDraft: (questionId: number, value: string) => void,
 * submitAnswer: (questionId: number) => Promise<void>,
 * deleteAnswer: (answerId: number) => Promise<void>,
 * loadMoreQuestions: () => Promise<void>,
 * hasMoreQuestions: boolean,
 * imageActionLoadingId: string,
 * removeImage: (imageId: number) => Promise<void>,
 * makeCoverImage: (imageId: number) => Promise<void>,
 * variantMode: string,
 * router: import("next/router").NextRouter,
 * }}
 */
export function useProductDetail() {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;
  const variationId = Array.isArray(router.query["variation-id"])
    ? router.query["variation-id"][0]
    : router.query["variation-id"];

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewPreview, setReviewPreview] = useState([]);
  const [reviewPreviewLoading, setReviewPreviewLoading] = useState(true);
  const [reviewPreviewError, setReviewPreviewError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");
  const [questionsPage, setQuestionsPage] = useState(1);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(false);
  const [questionDrafts, setQuestionDrafts] = useState({});
  const [imageActionLoadingId, setImageActionLoadingId] = useState("");

  const refresh = useCallback(async () => {
    if (!slug) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await fetchProductDetail(String(slug));
      setProduct(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Product could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const loadReviewPreview = useCallback(async () => {
    if (!slug) {
      return;
    }

    try {
      setReviewPreviewLoading(true);
      setReviewPreviewError("");
      const data = await fetchProductReviews({ slug: String(slug), page: 1 });
      const collection = normalizePaginatedCollection(data);
      setReviewPreview(collection.results.slice(0, 3));
    } catch (loadError) {
      setReviewPreview([]);
      setReviewPreviewError(
        loadError instanceof Error ? loadError.message : "Product reviews could not be loaded.",
      );
    } finally {
      setReviewPreviewLoading(false);
    }
  }, [slug]);

  const loadQuestions = useCallback(
    async (page, append = false) => {
      if (!slug) {
        return;
      }

      try {
        setQuestionsLoading(true);
        setQuestionsError("");
        const data = await fetchProductQuestions({ slug: String(slug), page });
        const collection = normalizePaginatedCollection(data);
        setQuestions((current) =>
          append ? [...current, ...collection.results] : collection.results,
        );
        setQuestionsPage(page);
        setHasMoreQuestions(
          Boolean(collection.next) || page * 15 < Number(collection.count || 0),
        );
      } catch (loadError) {
        if (!append) {
          setQuestions([]);
        }

        setQuestionsError(
          loadError instanceof Error ? loadError.message : "Product questions could not be loaded.",
        );
      } finally {
        setQuestionsLoading(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    let isCancelled = false;

    Promise.resolve().then(async () => {
      if (!isCancelled) {
        await Promise.all([refresh(), loadReviewPreview(), loadQuestions(1)]);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [loadQuestions, loadReviewPreview, refresh]);

  const activeVariation = useMemo(
    () => resolveActiveVariation(product?.prdtVari || [], variationId),
    [product?.prdtVari, variationId],
  );

  const shipZones = useMemo(
    () => parsePseudoArray(product?.prdtInfo?.sZones || product?.productDetailsInfo?.shipZones),
    [product],
  );

  const shipExZones = useMemo(
    () =>
      parsePseudoArray(
        product?.prdtInfo?.sxZones || product?.productDetailsInfo?.shipExZones,
      ),
    [product],
  );

  const attributes = useMemo(
    () => parseProductAttributes(product?.prdtInfo?.att || product?.productDetailsInfo?.attributes),
    [product],
  );

  async function selectVariation(nextVariationId) {
    await router.replace(
      {
        pathname: `/products/${slug}`,
        query: {
          "variation-id": String(nextVariationId),
          "variant-mode": product?.var ? "with-variant" : "without-variant",
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function deleteVariation(nextVariationId) {
    try {
      setError("");
      await deleteExistingVariation({ variationId: nextVariationId });
      await refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Variation could not be deleted.",
      );
    }
  }

  function updateQuestionDraft(questionId, value) {
    setQuestionDrafts((current) => ({
      ...current,
      [String(questionId)]: value,
    }));
  }

  async function submitAnswer(questionId) {
    const answer = String(questionDrafts[String(questionId)] || "").trim();

    if (!answer) {
      setQuestionsError("Enter an answer before submitting.");
      return;
    }

    try {
      setQuestionsError("");
      await createProductAnswer({ questionId, answer });
      setQuestionDrafts((current) => ({
        ...current,
        [String(questionId)]: "",
      }));
      await loadQuestions(1);
    } catch (submitError) {
      setQuestionsError(
        submitError instanceof Error ? submitError.message : "Answer could not be posted.",
      );
    }
  }

  async function removeAnswer(answerId) {
    try {
      setQuestionsError("");
      await deleteProductAnswer({ answerId });
      await loadQuestions(1);
    } catch (deleteError) {
      setQuestionsError(
        deleteError instanceof Error ? deleteError.message : "Answer could not be deleted.",
      );
    }
  }

  async function loadMoreQuestions() {
    if (!hasMoreQuestions || questionsLoading) {
      return;
    }

    await loadQuestions(questionsPage + 1, true);
  }

  async function voteReview(reviewId, vote) {
    try {
      setReviewPreviewError("");
      await voteProductReview({ reviewId, vote });
      setReviewPreview((current) =>
        current.map((review) => {
          if (Number(review?.id) !== Number(reviewId)) {
            return review;
          }

          return {
            ...review,
            vote,
            uCnt: vote === "1" ? Number(review?.uCnt || 0) + 1 : Number(review?.uCnt || 0),
            dCnt: vote === "0" ? Number(review?.dCnt || 0) + 1 : Number(review?.dCnt || 0),
          };
        }),
      );
    } catch (voteError) {
      setReviewPreviewError(
        voteError instanceof Error ? voteError.message : "Review vote could not be saved.",
      );
    }
  }

  async function removeImage(imageId) {
    try {
      setImageActionLoadingId(`remove-${imageId}`);
      await removeExistingProductImage({ imageId });
      await refresh();
    } catch (removeError) {
      setError(
        removeError instanceof Error ? removeError.message : "Image could not be removed.",
      );
    } finally {
      setImageActionLoadingId("");
    }
  }

  async function makeCoverImage(imageId) {
    try {
      setImageActionLoadingId(`cover-${imageId}`);
      await makeExistingProductCoverImage({ imageId });
      await refresh();
    } catch (coverError) {
      setError(
        coverError instanceof Error ? coverError.message : "Cover image could not be updated.",
      );
    } finally {
      setImageActionLoadingId("");
    }
  }

  return {
    product,
    activeVariation,
    isLoading,
    error,
    refresh,
    selectVariation,
    deleteVariation,
    shipZones,
    shipExZones,
    attributes,
    reviewPreview,
    reviewPreviewLoading,
    reviewPreviewError,
    voteReview,
    questions,
    questionsLoading,
    questionsError,
    questionDrafts,
    updateQuestionDraft,
    submitAnswer,
    deleteAnswer: removeAnswer,
    loadMoreQuestions,
    hasMoreQuestions,
    imageActionLoadingId,
    removeImage,
    makeCoverImage,
    variantMode: product?.var ? "with-variant" : "without-variant",
    router,
  };
}
