import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductReviews, voteProductReview } from "@/src/api/products";
import { normalizePaginatedCollection } from "@/src/utils/product";

/**
 * @param {string | string[] | undefined} value
 * @returns {string}
 */
function firstValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return typeof value === "string" ? value : "";
}

/**
 * @returns {{
 * slug: string,
 * page: number,
 * reviews: any[],
 * isLoading: boolean,
 * message: string,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * updateRoute: (page: number) => Promise<void>,
 * submitVote: (reviewId: number, vote: string) => Promise<void>,
 * }}
 */
export function useProductReviews() {
  const router = useRouter();
  const slug = useMemo(() => firstValue(router.query.slug), [router.query.slug]);
  const page = useMemo(
    () => Number(firstValue(router.query.page) || 1),
    [router.query.page],
  );

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!slug) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchProductReviews({ slug, page });
      const collection = normalizePaginatedCollection(data);
      setReviews(collection.results);
      setHasNextPage(Boolean(collection.next) || page * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setReviews([]);
      setMessage(error instanceof Error ? error.message : "Product reviews could not be loaded");
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, slug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadReviews();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadReviews]);

  async function updateRoute(nextPage) {
    await router.replace(
      {
        pathname: `/products/${slug}/reviews`,
        query: {
          page: String(nextPage),
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function submitVote(reviewId, vote) {
    try {
      setMessage("");
      await voteProductReview({ reviewId, vote });
      setReviews((current) =>
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product review vote failed");
    }
  }

  return {
    slug,
    page,
    reviews,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    updateRoute,
    submitVote,
  };
}
