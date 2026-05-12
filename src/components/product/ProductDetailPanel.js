import Link from "next/link";
import StoreSection from "@/src/components/store/StoreSection";
import { titleCaseValue } from "@/src/utils/product";

/**
 * @param {{
 * product: any,
 * activeVariation: any,
 * attributes: Record<string, string[]>,
 * shipZones: string[],
 * shipExZones: string[],
 * variantMode: string,
 * onSelectVariation: (variationId: number) => Promise<void>,
 * onDeleteVariation: (variationId: number) => Promise<void>,
 * reviewPreview: any[],
 * reviewPreviewLoading: boolean,
 * reviewPreviewError: string,
 * onVoteReview: (reviewId: number, vote: string) => Promise<void>,
 * questions: any[],
 * questionsLoading: boolean,
 * questionsError: string,
 * questionDrafts: Record<string, string>,
 * onUpdateQuestionDraft: (questionId: number, value: string) => void,
 * onSubmitAnswer: (questionId: number) => Promise<void>,
 * onDeleteAnswer: (answerId: number) => Promise<void>,
 * onLoadMoreQuestions: () => Promise<void>,
 * hasMoreQuestions: boolean,
 * imageActionLoadingId: string,
 * onRemoveImage: (imageId: number) => Promise<void>,
 * onMakeCoverImage: (imageId: number) => Promise<void>,
 * }} props
 */
export default function ProductDetailPanel({
  product,
  activeVariation,
  attributes,
  shipZones,
  shipExZones,
  variantMode,
  onSelectVariation,
  onDeleteVariation,
  reviewPreview,
  reviewPreviewLoading,
  reviewPreviewError,
  onVoteReview,
  questions,
  questionsLoading,
  questionsError,
  questionDrafts,
  onUpdateQuestionDraft,
  onSubmitAnswer,
  onDeleteAnswer,
  onLoadMoreQuestions,
  hasMoreQuestions,
  imageActionLoadingId,
  onRemoveImage,
  onMakeCoverImage,
}) {
  const imageList = product?.var ? activeVariation?.imgs || [] : product?.prdtImg || [];
  const variationImageGroups = product?.var
    ? (product?.prdtVari || []).map((variation) => ({
        variation,
        images: variation?.imgs || [],
      }))
    : [];
  const currentPrice = product?.var ? activeVariation?.price : product?.prdtInfo?.price;
  const currentMrp = product?.var ? activeVariation?.mrp : product?.prdtInfo?.mrp;
  const currentStock = product?.var ? activeVariation?.mStock : product?.mStock;
  const currentSku = product?.var ? activeVariation?.sku : product?.prdtInfo?.sCode;
  const isApproved = Boolean(product?.approved ?? product?.aprvd ?? false);
  const soldLabel = product?.var ? "NA" : String(product?.sold || 0);
  const title = product?.title || product?.tit || "Product";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)]">
        <StoreSection
          title="Media"
          subtitle={
            product?.var
              ? "Variant listings keep images per variation. The active variation controls direct image actions."
              : "Primary product media and direct image actions from the detail workspace."
          }
        >
          {product?.var ? (
            variationImageGroups.some((group) => group.images.length) ? (
              <div className="space-y-5">
                {variationImageGroups.map((group) =>
                  group.images.length ? (
                    <div
                      className="rounded-sm border border-white/10 bg-black/20 p-4"
                      key={group.variation?.id}
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-bold text-brand-white">
                          {titleCaseValue(group.variation?.vAtion)} / {group.variation?.vTypes?.[0]?.name} / {group.variation?.vTypes?.[0]?.tMap}
                        </p>
                        <Link
                          className="rounded-sm border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-white hover:border-brand-gold hover:text-brand-gold"
                          href={`/products/${product.slug}/variations/${group.variation?.id}/images?variant-mode=${variantMode}`}
                        >
                          Manage
                        </Link>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {group.images.map((image) => (
                          <MediaCard
                            key={image.id}
                            image={image}
                            title={title}
                            canManage={Number(group.variation?.id || 0) === Number(activeVariation?.id || 0)}
                            imageActionLoadingId={imageActionLoadingId}
                            onMakeCoverImage={onMakeCoverImage}
                            onRemoveImage={onRemoveImage}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            ) : (
              <div className="rounded-sm border border-dashed border-white/15 bg-black/20 p-8 text-sm text-white/55">
                No images uploaded yet.
              </div>
            )
          ) : imageList.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {imageList.map((image) => (
                <MediaCard
                  key={image.id}
                  image={image}
                  title={title}
                  canManage
                  imageActionLoadingId={imageActionLoadingId}
                  onMakeCoverImage={onMakeCoverImage}
                  onRemoveImage={onRemoveImage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-white/15 bg-black/20 p-8 text-sm text-white/55">
              No images uploaded yet.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
              href={
                product?.var
                  ? `/products/${product.slug}/variations/${activeVariation?.id}/images`
                  : `/products/${product.slug}/images`
              }
            >
              Manage Images
            </Link>
            {product?.var ? (
              <Link
                className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                href={`/products/${product.slug}/new-variation?variant-mode=${variantMode}`}
              >
                Add New Variation
              </Link>
            ) : null}
            <a
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
              href={`https://www.shopdibz.com/products/detail/${product.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              View Live Product
            </a>
          </div>
        </StoreSection>

        <StoreSection
          title="Overview"
          subtitle="Core commercial data, catalog status, and quick actions."
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-brand-white">{title}</h2>
              <p className="mt-2 text-sm text-white/55">
                {product?.prdtInfo?.brd || product?.prdtInfo?.pub || "No brand or publisher"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Price", `Rs. ${Number(currentPrice || 0).toFixed(2)}`],
                ["MRP", `Rs. ${Number(currentMrp || 0).toFixed(2)}`],
                ["Stock", `${currentStock || 0}`],
                ["Sold", soldLabel],
                ["Views", `${product?.vCnt || 0}`],
                ["Rating", `${product?.rating || 0} / 5`],
                ["Reviews", `${product?.rCount || 0}`],
                ["Status", isApproved ? "Active" : "Pending approval"],
              ].map(([label, value]) => (
                <div className="rounded-sm border border-white/10 bg-black/20 p-4" key={label}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-bold text-brand-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm leading-6 text-white/65">
              <p>Slug: {product?.slug}</p>
              <p>HSN: {product?.hsn || "-"}</p>
              <p>SKU: {currentSku || "-"}</p>
              <p>Variation Mode: {product?.var ? "With variant" : "Without variant"}</p>
              <p>Prebooking: {product?.prebook ? "Enabled" : "Disabled"}</p>
              <p>Shipping Profile: {product?.shProf ? "Custom zones" : "All India"}</p>
              {product?.promoted ? <p>Campaign ID: {product?.promoRef || "-"}</p> : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                href={`/products/${product.slug}/edit?variant-mode=${variantMode}`}
              >
                Edit Product
              </Link>
              <Link
                className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                href={`/products/${product.slug}/reviews`}
              >
                Product Reviews
              </Link>
              {product?.var && activeVariation ? (
                <Link
                  className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                  href={`/products/${product.slug}/variations/${activeVariation.id}/edit?variant-mode=${variantMode}`}
                >
                  Edit Selected Variation
                </Link>
              ) : null}
            </div>
          </div>
        </StoreSection>
      </div>

      {product?.var ? (
        <StoreSection
          title="Variations"
          subtitle="Select the active variant from the URL-linked list below."
        >
          <div className="space-y-3">
            {product.prdtVari.map((variation) => (
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-white/10 bg-black/20 p-4"
                key={variation.id}
              >
                <button
                  className="text-left"
                  type="button"
                  onClick={() => onSelectVariation(variation.id)}
                >
                  <p className="text-sm font-bold text-brand-white">
                    {titleCaseValue(variation.vAtion)} / {variation.vTypes?.[0]?.name} / {variation.vTypes?.[0]?.tMap}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Rs. {Number(variation.price || 0).toFixed(2)} / MRP Rs.{" "}
                    {Number(variation.mrp || 0).toFixed(2)} / SKU {variation.sku || "-"}
                  </p>
                </button>
                <div className="flex flex-wrap gap-3">
                  <Link
                    className="rounded-sm border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-white"
                    href={`/products/${product.slug}/variations/${variation.id}/images?variant-mode=${variantMode}`}
                  >
                    Images
                  </Link>
                  <Link
                    className="rounded-sm border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-white"
                    href={`/products/${product.slug}/variations/${variation.id}/edit?variant-mode=${variantMode}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="rounded-sm border border-red-400/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-300"
                    type="button"
                    onClick={() => onDeleteVariation(variation.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </StoreSection>
      ) : null}

      <StoreSection title="Description & Catalog Metadata">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-5">
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Description
              </p>
              <div
                className="prose prose-invert mt-4 max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: product?.prdtInfo?.desc || "" }}
              />
            </div>
            <div className="rounded-sm border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/65">
              <p>Brand authenticity: {product?.prdtInfo?.brdCert ? "Available" : "Not provided"}</p>
              <p>Video URL: {product?.prdtInfo?.vUrl || "-"}</p>
              <p>Condition: {product?.prdtInfo?.con === "N" ? "New" : "Refurbished"}</p>
              <p>Show size chart: {product?.prdtInfo?.showChart ? "Enabled" : "Disabled"}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Keywords
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(product?.prdtInfo?.keys || []).map((keyword) => (
                  <span
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-brand-white"
                    key={keyword}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Attributes
              </p>
              <div className="mt-4 space-y-3">
                {Object.entries(attributes).map(([key, value]) => (
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3" key={key}>
                    <p className="text-sm font-semibold text-brand-white">{key}</p>
                    <p className="text-sm text-white/55">{value.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </StoreSection>

      <StoreSection
        title="Product Reviews"
        subtitle="Inline review preview from the live product feed."
      >
        {reviewPreviewError ? <p className="text-sm text-brand-gold">{reviewPreviewError}</p> : null}

        {reviewPreviewLoading ? (
          <div className="rounded-sm border border-white/10 bg-black/20 p-6 text-sm text-white/55">
            Loading reviews...
          </div>
        ) : reviewPreview.length ? (
          <div className="space-y-4">
            {reviewPreview.map((review) => (
              <article
                className="rounded-sm border border-white/10 bg-black/20 p-4"
                key={review?.id}
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-brand-white">
                          {review?.user?.fName || review?.user?.name || "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {formatDate(review?.time || review?.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-brand-gold">
                        Rating {Number(review?.rating || 0).toFixed(1)}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {review?.review || review?.comment || "No review text"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <VoteButton
                      active={review?.vote === "1"}
                      label={`Up ${Number(review?.uCnt || 0)}`}
                      onClick={() => onVoteReview(review.id, "1")}
                    />
                    <VoteButton
                      active={review?.vote === "0"}
                      label={`Down ${Number(review?.dCnt || 0)}`}
                      onClick={() => onVoteReview(review.id, "0")}
                    />
                  </div>
                </div>
              </article>
            ))}
            <div>
              <Link
                className="text-sm font-bold text-brand-gold hover:text-brand-white"
                href={`/products/${product.slug}/reviews`}
              >
                View all reviews
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-white/15 bg-black/20 p-8 text-sm text-white/55">
            No reviews for this product yet.
          </div>
        )}
      </StoreSection>

      <StoreSection
        title="Questions & Answers"
        subtitle="Seller-facing product Q&A with answer controls."
      >
        {questionsError ? <p className="text-sm text-brand-gold">{questionsError}</p> : null}

        {questionsLoading && !questions.length ? (
          <div className="rounded-sm border border-white/10 bg-black/20 p-6 text-sm text-white/55">
            Loading questions...
          </div>
        ) : questions.length ? (
          <div className="space-y-4">
            {questions.map((question) => {
              const firstAnswer = Array.isArray(question?.ans) ? question.ans[0] : null;
              const draftValue = questionDrafts[String(question?.id)] || "";

              return (
                <article
                  className="rounded-sm border border-white/10 bg-black/20 p-4"
                  key={question?.id}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-brand-black text-sm font-bold text-brand-gold">
                      <ActionIcon type="question" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-brand-white">{question?.qus || "Question"}</p>
                      {firstAnswer ? (
                        <div className="mt-4 rounded-sm border border-white/10 bg-black/25 p-3">
                          <p className="text-sm text-white/70">{firstAnswer?.ans || ""}</p>
                          <button
                            className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-red-300 hover:text-red-200"
                            type="button"
                            onClick={() => onDeleteAnswer(firstAnswer.id)}
                          >
                            <ActionIcon type="trash" />
                            Delete Answer
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          <textarea
                            className="min-h-24 w-full rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm text-brand-white outline-none placeholder:text-white/25"
                            placeholder="What's your answer?"
                            value={draftValue}
                            onChange={(event) => onUpdateQuestionDraft(question.id, event.target.value)}
                          />
                          <button
                            className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                            type="button"
                            onClick={() => onSubmitAnswer(question.id)}
                          >
                            <ActionIcon type="send" />
                            Submit Answer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            {hasMoreQuestions ? (
              <div>
                <button
                  className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                  type="button"
                  onClick={onLoadMoreQuestions}
                >
                  Load More Questions
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-white/15 bg-black/20 p-8 text-sm text-white/55">
            No questions to display.
          </div>
        )}
      </StoreSection>

      {product?.shProf ? (
        <StoreSection title="Shipping Profile">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Shipping Zones
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {shipZones.map((zone) => (
                  <span
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-brand-white"
                    key={zone}
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Excluded Zones
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {shipExZones.map((zone) => (
                  <span
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-brand-white"
                    key={zone}
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </StoreSection>
      ) : null}
    </div>
  );
}

function MediaCard({
  image,
  title,
  canManage,
  imageActionLoadingId,
  onMakeCoverImage,
  onRemoveImage,
}) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 p-3">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={title}
          className="h-full w-full object-contain"
          src={image.images || ""}
        />
        {image.cover ? (
          <span className="absolute left-3 top-3 rounded-full border border-brand-gold/30 bg-black/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold">
            Cover
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
          {image.cover ? "Cover image" : "Gallery image"}
        </p>
        {canManage ? (
          <div className="flex flex-wrap gap-2">
            {!image.cover ? (
              <button
                className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-white hover:border-brand-gold hover:text-brand-gold"
                type="button"
                disabled={imageActionLoadingId === `cover-${image.id}`}
                onClick={() => onMakeCoverImage(image.id)}
              >
                <ActionIcon type="star" />
                {imageActionLoadingId === `cover-${image.id}` ? "Saving..." : "Make Cover"}
              </button>
            ) : null}
            <button
              className="inline-flex items-center gap-2 rounded-sm border border-red-400/35 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-red-300 hover:border-red-300 hover:text-red-200"
              type="button"
              disabled={imageActionLoadingId === `remove-${image.id}`}
              onClick={() => onRemoveImage(image.id)}
            >
              <ActionIcon type="trash" />
              {imageActionLoadingId === `remove-${image.id}` ? "Removing..." : "Delete"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-white/40">
            Select this variation to make cover or delete images here.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{ label: string, active: boolean, onClick: () => Promise<void> }} props
 */
function VoteButton({ label, active, onClick }) {
  return (
    <button
      className={`rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] ${
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

function ActionIcon({ type }) {
  if (type === "trash") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9Z" />
      </svg>
    );
  }

  if (type === "send") {
    return (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4Z" />
      </svg>
    );
  }

  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/**
 * @param {string | Date} value
 * @returns {string}
 */
function formatDate(value) {
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
