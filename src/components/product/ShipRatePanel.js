import AuthButton from "@/src/components/auth/AuthButton";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ form: any, result: any, isSubmitting: boolean, setFormField: (field: string, value: string) => void, submit: () => Promise<void> }} props
 */
export default function ShipRatePanel({
  form,
  result,
  isSubmitting,
  setFormField,
  submit,
}) {
  return (
    <div className="space-y-6">
      <StoreSection
        title="Shipping Rate Calculator"
        subtitle="Check estimated shipping rates before you confirm fulfilment."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <StoreField label="Pickup Pin" value={form.pickupPin} onChange={(value) => setFormField("pickupPin", value)} />
          <StoreField label="Delivery Pin" value={form.deliveryPin} onChange={(value) => setFormField("deliveryPin", value)} />
          <StoreField label="Weight (grams)" value={form.weight} onChange={(value) => setFormField("weight", value)} />
          <StoreField label="Length" value={form.length} onChange={(value) => setFormField("length", value)} />
          <StoreField label="Width" value={form.width} onChange={(value) => setFormField("width", value)} />
          <StoreField label="Height" value={form.height} onChange={(value) => setFormField("height", value)} />
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Shipping Mode</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.shippingMode}
              onChange={(event) => setFormField("shippingMode", event.target.value)}
            >
              <option className="bg-black" value="air">Air</option>
              <option className="bg-black" value="surface">Surface</option>
            </select>
          </label>
        </div>
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submit}>
          {isSubmitting ? "Checking..." : "Check Shipping Rate"}
        </AuthButton>
      </div>

      {result ? (
        <StoreSection title="Available Rate">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Zone</p>
              <p className="mt-2 text-lg font-bold text-brand-white">{result.zone || "-"}</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Cost</p>
              <p className="mt-2 text-lg font-bold text-brand-white">Rs. {result.total_amount || result.totalAmount || "-"}</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Charged Weight</p>
              <p className="mt-2 text-lg font-bold text-brand-white">{result.charged_weight || result.chargedWeight || "-"} gms</p>
            </div>
          </div>
        </StoreSection>
      ) : null}
    </div>
  );
}
