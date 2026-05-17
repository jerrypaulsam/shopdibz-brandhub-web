/**
 * @param {{
 * reviews: any[],
 * isLoading: boolean,
 * message: string,
 * page: number,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * onUpdateRoute: (page: number) => Promise<void>,
 * onVote: (reviewId: number, vote: string) => Promise<void>,
 * }} props
 */
export default function ProductReviewsPanel({
  reviews,
  isLoading,
  message,
  page,
  hasNextPage,
  hasPreviousPage,
  onUpdateRoute,
  onVote,
}) {
  const ratingSummary =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      <section className="theme-panel rounded-sm border p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Product Feedback
            </p>
            <h1 className="mt-3 text-3xl font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
              Product Reviews
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Visible Reviews" value={String(reviews.length)} />
            <Metric label="Average Rating" value={`${ratingSummary} / 5`} />
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="theme-panel rounded-sm border p-8 text-sm theme-text-muted">
            Loading product reviews...
          </div>
        ) : reviews.length ? (
          reviews.map((review) => (
            <article className="theme-panel rounded-sm border p-5" key={review?.id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="theme-surface flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black text-brand-gold">
                    {String(review?.user?.fName || review?.user?.name || "U").slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-bold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
                          {review?.user?.fName || review?.user?.name || "Customer"}
                        </p>
                        <p className="theme-text-muted mt-1 text-xs">
                          {formatReviewDate(review?.time || review?.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-brand-gold">
                        {renderStars(Number(review?.rating || 0))}
                      </p>
                    </div>
                    <p className="theme-text-muted mt-4 text-sm leading-6">
                      {review?.review || review?.comment || "No review text"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <VoteButton
                    label={`Up ${Number(review?.uCnt || 0)}`}
                    active={review?.vote === "1"}
                    onClick={() => onVote(review.id, "1")}
                  />
                  <VoteButton
                    label={`Down ${Number(review?.dCnt || 0)}`}
                    active={review?.vote === "0"}
                    onClick={() => onVote(review.id, "0")}
                  />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="theme-panel rounded-sm border border-dashed p-12 text-center">
            <p className="text-lg font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
              No Product Reviews Yet
            </p>
            <p className="theme-text-muted mt-2 text-sm">
              Feedback for this product will appear here once customers start reviewing it.
            </p>
          </div>
        )}
      </section>

      <section className="theme-panel flex flex-wrap items-center justify-between gap-3 rounded-sm border p-4">
        <button
          className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onUpdateRoute(Math.max(page - 1, 1))}
        >
          Previous
        </button>
        <p className="theme-text-muted text-sm font-semibold">Page {page}</p>
        <button
          className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40"
          type="button"
          disabled={!hasNextPage}
          onClick={() => onUpdateRoute(page + 1)}
        >
          Next
        </button>
      </section>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="theme-surface-soft rounded-sm border p-4">
      <p className="theme-text-muted text-xs font-bold uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-2 text-lg font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
        {value}
      </p>
    </div>
  );
}

/**
 * @param {{ label: string, active: boolean, onClick: () => Promise<void> }} props
 */
function VoteButton({ label, active, onClick }) {
  return (
    <button
      className={`rounded-sm border px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
          : "theme-action-neutral"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * @param {number} value
 * @returns {string}
 */
function renderStars(value) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  return `${"*".repeat(rounded)}${"-".repeat(5 - rounded)} ${value.toFixed(1)}`;
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
