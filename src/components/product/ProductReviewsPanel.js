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
      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Product Feedback
            </p>
            <h1 className="mt-3 text-3xl font-black text-brand-white">Product Reviews</h1>
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
          <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/45">
            Loading product reviews...
          </div>
        ) : reviews.length ? (
          reviews.map((review) => (
            <article
              className="rounded-sm border border-white/10 bg-[#121212] p-5"
              key={review?.id}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30 text-sm font-black text-brand-gold">
                    {String(review?.user?.fName || review?.user?.name || "U").slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-bold text-brand-white">
                          {review?.user?.fName || review?.user?.name || "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {formatReviewDate(review?.time || review?.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-brand-gold">
                        {renderStars(Number(review?.rating || 0))}
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/70">
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
          <div className="rounded-sm border border-dashed border-white/15 bg-[#121212] p-12 text-center">
            <p className="text-lg font-black text-brand-white">No Product Reviews Yet</p>
            <p className="mt-2 text-sm text-white/45">
              Feedback for this product will appear here once customers start reviewing it.
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-white/10 bg-[#121212] p-4">
        <button
          className="rounded-sm border border-white/10 px-4 py-2 text-sm font-semibold text-brand-white disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onUpdateRoute(Math.max(page - 1, 1))}
        >
          Previous
        </button>
        <p className="text-sm font-semibold text-white/55">Page {page}</p>
        <button
          className="rounded-sm border border-white/10 px-4 py-2 text-sm font-semibold text-brand-white disabled:opacity-40"
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
    <div className="rounded-sm border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-2 text-lg font-black text-brand-white">{value}</p>
    </div>
  );
}

/**
 * @param {{ label: string, active: boolean, onClick: () => Promise<void> }} props
 */
function VoteButton({ label, active, onClick }) {
  return (
    <button
      className={`rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
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
