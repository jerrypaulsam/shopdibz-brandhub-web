const COMMISSION_RATE = 0.045;
const COMMISSION_GST_RATE = 0.18;
const GATEWAY_FEE_RATE = 0.02;
const GATEWAY_FEE_GST_RATE = 0.18;
const TCS_RATE = 0.005;

function formatEstimateMoney(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function parseMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function getEstimate(priceValue) {
  const sellingPrice = parseMoney(priceValue);
  const commissionBase = sellingPrice * COMMISSION_RATE;
  const commissionGst = commissionBase * COMMISSION_GST_RATE;
  const gatewayFeeBase = sellingPrice * GATEWAY_FEE_RATE;
  const gatewayFeeGst = gatewayFeeBase * GATEWAY_FEE_GST_RATE;
  const tcs = sellingPrice * TCS_RATE;
  const sellerGets = Math.max(
    0,
    sellingPrice - commissionBase - commissionGst - gatewayFeeBase - gatewayFeeGst - tcs,
  );

  return {
    sellingPrice,
    commissionBase,
    commissionGst,
    gatewayFeeBase,
    gatewayFeeGst,
    tcs,
    sellerGets,
  };
}

/**
 * @param {{ price: string | number, className?: string }} props
 */
export default function SellerPayoutEstimateCard({ price, className = "" }) {
  const estimate = getEstimate(price);
  const hasPrice = estimate.sellingPrice > 0;

  return (
    <aside
      className={`rounded-[18px] border border-brand-gold/20 bg-brand-gold/10 p-4 [html[data-theme='light']_&]:border-brand-gold/30 [html[data-theme='light']_&]:bg-brand-gold/12 ${className}`.trim()}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
        Approx Seller Payout
      </p>
      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
        This is an approximate estimate based on current deductions. Shipping fee is not included in this estimate.
      </p>

      {hasPrice ? (
        <div className="mt-4 space-y-3">
          <EstimateRow label="Selling Price" value={estimate.sellingPrice} />
          <EstimateRow label="Commission (4.5%)" value={estimate.commissionBase} negative />
          <EstimateRow label="GST on Commission (18%)" value={estimate.commissionGst} negative />
          <EstimateRow label="Gateway Fee (2%)" value={estimate.gatewayFeeBase} negative />
          <EstimateRow label="GST on Gateway Fee (18%)" value={estimate.gatewayFeeGst} negative />
          <EstimateRow label="TCS (0.5%)" value={estimate.tcs} negative />
          <div className="rounded-[14px] border border-brand-gold/25 bg-black/15 px-4 py-3 [html[data-theme='light']_&]:bg-white/35">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <span className="text-sm font-bold text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                Seller Gets
              </span>
              <span className="whitespace-nowrap text-right text-sm font-extrabold tabular-nums text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                {formatEstimateMoney(estimate.sellerGets)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[14px] border border-white/10 bg-black/15 px-4 py-3 text-sm leading-6 text-white/60 [html[data-theme='light']_&]:bg-white/35 [html[data-theme='light']_&]:text-[#5f4339]">
          Enter a selling price to preview the approximate seller payout.
        </div>
      )}

      <p className="mt-3 text-xs leading-5 text-white/45 [html[data-theme='light']_&]:text-[#6b5046]">
        This estimate does not include penalties, store coupon effects, shipping fee, or final settlement adjustments.
      </p>
    </aside>
  );
}

function EstimateRow({ label, value, negative = false }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[14px] border border-white/10 bg-black/10 px-4 py-3 [html[data-theme='light']_&]:bg-white/30">
      <span className="min-w-0 text-sm text-white/60 [html[data-theme='light']_&]:text-[#6b5046]">
        {label}
      </span>
      <span className="whitespace-nowrap text-right text-sm font-semibold tabular-nums text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
        {negative ? "-" : ""}
        {formatEstimateMoney(value)}
      </span>
    </div>
  );
}
