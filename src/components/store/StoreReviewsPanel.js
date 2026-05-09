/* eslint-disable @next/next/no-img-element */

import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreSection from "./StoreSection";

/**
 * @param {{ reviews: any[], hasNextPage: boolean, isLoading: boolean, isLoadingMore: boolean, message: string, onLoadMore: () => Promise<void>, onVote: (reviewId: number, vote: string) => Promise<void> }} props
 */
export default function StoreReviewsPanel({
  reviews,
  hasNextPage,
  isLoading,
  isLoadingMore,
  message,
  onLoadMore,
  onVote,
}) {
  return (
    <StoreSection title="Store Reviews" subtitle="Customer feedback, rating, and vote moderation for your store.">
      <AuthMessage>{message}</AuthMessage>

      {isLoading ? (
        <p className="mt-6 text-sm text-white/45">Loading reviews...</p>
      ) : reviews.length ? (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <ReviewRow review={review} onVote={onVote} key={review.id} />
          ))}
        </div>
      ) : (
        <div className="mt-6 py-12 text-center">
          <p className="text-base font-bold text-brand-white">No Reviews Yet</p>
          <p className="mt-2 text-sm text-white/45">
            Store reviews from customers will appear here once they come in.
          </p>
        </div>
      )}

      {hasNextPage && reviews.length ? (
        <div className="mt-6 flex justify-center">
          <button
            className="rounded-sm border border-white/15 px-5 py-2 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-60"
            type="button"
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      ) : null}
    </StoreSection>
  );
}

/**
 * @param {{ review: any, onVote: (reviewId: number, vote: string) => Promise<void> }} props
 */
function ReviewRow({ review, onVote }) {
  return (
    <article className="rounded-sm border border-white/10 bg-black/20 p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full gap-4 md:max-w-[150px] md:flex-col">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5">
            {review?.user?.pPic ? (
              <img
                src={review.user.pPic}
                alt={review?.user?.fName || "Reviewer"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-brand-gold">
                {String(review?.user?.fName || "U").slice(0, 1)}
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <VoteButton
              label={`Up ${review?.uCnt || 0}`}
              active={review?.vote === "1"}
              onClick={() => onVote(review.id, "1")}
            />
            <VoteButton
              label={`Down ${review?.dCnt || 0}`}
              active={review?.vote === "0"}
              onClick={() => onVote(review.id, "0")}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-brand-white">
              {review?.user?.fName || "Customer"}
            </p>
            <p className="text-sm font-bold text-brand-gold">
              Rating: {review?.rating || 0}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">
            {review?.review || "No review text"}
          </p>
          <p className="mt-3 text-xs text-white/35">
            {formatReviewDate(review?.time || review?.timestamp)}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * @param {{ label: string, active: boolean, onClick: () => void }} props
 */
function VoteButton({ label, active, onClick }) {
  return (
    <button
      className={`inline-flex min-h-9 items-center rounded-sm border px-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
        active
          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
          : "border-white/10 text-white/55 hover:border-brand-gold hover:text-brand-gold"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * @param {string | Date} value
 * @returns {string}
 */
function formatReviewDate(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "---";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
