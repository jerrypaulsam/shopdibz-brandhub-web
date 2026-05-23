import { useState } from "react";
import {
  PRODUCT_SHIP_EX_ZONE_OPTIONS,
  PRODUCT_SHIP_ZONES,
  PRODUCT_ZONE_DETAILS,
} from "@/src/data/product-variation-options";

/**
 * @param {{
 * selectedZones: string[],
 * selectedExcludedZones: string[],
 * toggleShipZone: (value: string) => void,
 * toggleShipExZone: (value: string) => void,
 * }} props
 */
export default function ShippingZoneSelector({
  selectedZones,
  selectedExcludedZones,
  toggleShipZone,
  toggleShipExZone,
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  function formatZoneLabel(value) {
    const normalized = String(value || "").trim().toUpperCase();

    if (normalized === "NORTHEAST") {
      return "Northeast";
    }

    return normalized.charAt(0) + normalized.slice(1).toLowerCase();
  }

  return (
    <>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-brand-white">Delivery Zones</p>
            <button
              className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/55 bg-red-500/14 px-2.5 py-1.5 text-xs font-semibold text-red-100 shadow-[0_0_0_1px_rgba(239,68,68,0.08)] transition-colors hover:border-red-400 hover:bg-red-500/18 hover:text-white [html[data-theme='light']_&]:border-red-600/45 [html[data-theme='light']_&]:bg-red-600 [html[data-theme='light']_&]:text-white [html[data-theme='light']_&]:shadow-[0_0_0_1px_rgba(220,38,38,0.08)] [html[data-theme='light']_&]:hover:border-red-700 [html[data-theme='light']_&]:hover:bg-red-700"
              type="button"
              onClick={() => setIsGuideOpen(true)}
            >
              <span
                aria-hidden="true"
                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] leading-none"
              >
                ?
              </span>
              Zone Details
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRODUCT_SHIP_ZONES.map((zone) => {
              const active = selectedZones.includes(zone);
              return (
                <button
                  className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                    active
                      ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                      : "border-white/10 text-white/55"
                  }`}
                  key={zone}
                  type="button"
                  onClick={() => toggleShipZone(zone)}
                >
                  {formatZoneLabel(zone)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-brand-white">Excluded Delivery States</p>
          <div className="mt-3 flex max-h-60 flex-wrap gap-2 overflow-y-auto">
            {PRODUCT_SHIP_EX_ZONE_OPTIONS.map((zone) => {
              const active = selectedExcludedZones.includes(zone.value);
              return (
                <button
                  className={`rounded-full border px-3 py-2 text-xs font-bold tracking-[0.02em] ${
                    active
                      ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                      : "border-white/10 text-white/55"
                  }`}
                  key={zone.value}
                  type="button"
                  onClick={() => toggleShipExZone(zone.value)}
                >
                  {zone.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isGuideOpen ? (
        <div className="fixed inset-0 z-[90]">
          <button
            aria-label="Close zone details"
            className="theme-overlay absolute inset-0"
            type="button"
            onClick={() => setIsGuideOpen(false)}
          />
          <aside className="theme-surface absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Shipping Guide
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-brand-white">
                  Zone coverage details
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Use this reference when deciding which regions to include in the
                  delivery profile and which states to exclude.
                </p>
              </div>
              <button
                className="theme-action-neutral inline-flex h-10 w-10 items-center justify-center rounded-sm border transition-colors"
                type="button"
                onClick={() => setIsGuideOpen(false)}
              >
                x
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {PRODUCT_ZONE_DETAILS.map((zone) => (
                <section className="rounded-sm border border-white/10 p-4" key={zone.value}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-brand-white">
                      {zone.label}
                    </h4>
                    <span className="text-xs font-semibold text-white/45">
                      {zone.states.length} states / regions
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {zone.states.map((state) => (
                      <span
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70"
                        key={state}
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
