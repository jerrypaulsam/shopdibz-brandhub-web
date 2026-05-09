import { useEffect, useState } from "react";
import { fetchStoreReviews, voteStoreReview } from "@/src/api/store";
import { getAuthSession } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

export function useStoreReviews() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const data = await fetchStoreReviews(1);

        if (!isCurrent) {
          return;
        }

        setReviews(data?.results || []);
        setHasNextPage(Boolean(data?.next));
        setPage(1);

        const authSession = getAuthSession();
        logScreenView(
          "store_reviews",
          authSession?.user?.storeUrl || authSession?.storeUrl || "Anonymous",
          "store",
        );
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Reviews could not be loaded");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function loadMore() {
    if (!hasNextPage || isLoadingMore) {
      return;
    }

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const data = await fetchStoreReviews(nextPage);
      setReviews((current) => [...current, ...(data?.results || [])]);
      setHasNextPage(Boolean(data?.next));
      setPage(nextPage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load more reviews");
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function submitVote(reviewId, vote) {
    try {
      await voteStoreReview({ reviewId, vote });

      setReviews((current) =>
        current.map((review) => {
          if (review.id !== reviewId) {
            return review;
          }

          return {
            ...review,
            vote,
            uCnt: vote === "1" ? Number(review.uCnt || 0) + 1 : Number(review.uCnt || 0),
            dCnt: vote === "0" ? Number(review.dCnt || 0) + 1 : Number(review.dCnt || 0),
          };
        }),
      );

      setMessage(vote === "1" ? "Up voted successfully" : "Down voted successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Voting failed");
    }
  }

  return {
    reviews,
    hasNextPage,
    isLoading,
    isLoadingMore,
    message,
    loadMore,
    submitVote,
  };
}
