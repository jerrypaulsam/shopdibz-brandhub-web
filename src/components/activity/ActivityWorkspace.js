import Link from "next/link";
import ActivityActionCard from "./ActivityActionCard";
import BulkUpdatePanel from "./BulkUpdatePanel";
import MonthlyInvoicePanel from "./MonthlyInvoicePanel";
import ProductGroupCreatePanel from "./ProductGroupCreatePanel";
import SpecialProductsPanel from "./SpecialProductsPanel";
import { ACTIVITY_PANELS } from "@/src/utils/activity";

/**
 * @typedef {Object} ActivityWorkspaceProps
 * @property {{ slug: string, label: string, description: string }} activePanel
 * @property {{ slug: string }} activeBulkMode
 * @property {{ slug: string }} activeSpecialType
 * @property {string} bulkFileName
 * @property {string} groupDiscount
 * @property {string} groupDiscountType
 * @property {string} groupImageName
 * @property {string} groupName
 * @property {any[]} groups
 * @property {number} groupsCount
 * @property {boolean} isActionLoading
 * @property {boolean} isLoading
 * @property {boolean} isMobileVerified
 * @property {boolean} isPremium
 * @property {string} message
 * @property {string} month
 * @property {string} pricingUrl
 * @property {string} selectedInvoiceLabel
 * @property {boolean} showOnHome
 * @property {string} specialFileName
 * @property {any} storeInfo
 * @property {string} year
 * @property {string} actionMessage
 * @property {string} actionError
 * @property {(event: import("react").ChangeEvent<HTMLInputElement>, target: "bulk" | "special" | "group") => void} onFileSelect
 * @property {(value: string) => void} selectPanel
 * @property {(value: string) => void} setBulkMode
 * @property {(value: string) => void} setGroupDiscount
 * @property {(value: string) => void} setGroupDiscountType
 * @property {(value: string) => void} setGroupName
 * @property {(value: string) => void} setInvoiceMonth
 * @property {(value: string) => void} setInvoiceYear
 * @property {(value: boolean) => void} setShowOnHome
 * @property {(value: string) => void} setSpecialType
 * @property {() => void} submitBulkUpdate
 * @property {() => void} submitMonthlyInvoice
 * @property {() => void} submitProductGroupCreate
 * @property {() => void} submitSpecialRemove
 * @property {() => void} submitSpecialUpload
 */

/**
 * @param {ActivityWorkspaceProps} props
 */
export default function ActivityWorkspace(props) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Activity
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            Seller activity console
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Operations, merchandising, and finance actions stay direct-linkable here
            instead of hiding in one-off dialogs. The backend still follows the
            Flutter activity endpoints.
          </p>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Readiness
          </h2>
          <div className="mt-4 space-y-3">
            <MetaCard
              label="Store plan"
              value={props.isPremium ? "Premium" : "Standard"}
            />
            <MetaCard
              label="Mobile verification"
              value={props.isMobileVerified ? "Complete" : "Pending"}
            />
            <MetaCard
              label="Product groups"
              value={String(props.groupsCount)}
            />
          </div>
          {props.pricingUrl ? (
            <a
              className="mt-5 inline-flex min-h-10 items-center rounded-sm border border-brand-gold/30 px-4 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
              href={props.pricingUrl}
              rel="noreferrer"
              target="_blank"
            >
              View pricing
            </a>
          ) : null}
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {ACTIVITY_PANELS.map((panel) => (
          <ActivityActionCard
            active={props.activePanel.slug === panel.slug}
            description={panel.description}
            eyebrow={panel.eyebrow}
            key={panel.slug}
            title={panel.label}
            onOpen={() => props.selectPanel(panel.slug)}
          />
        ))}
      </section>

      {props.message ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {props.message}
        </div>
      ) : null}

      {props.actionError ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {props.actionError}
        </div>
      ) : null}

      {props.actionMessage ? (
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {props.actionMessage}
        </div>
      ) : null}

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {props.isLoading ? (
            <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
              Loading activity workspace...
            </div>
          ) : null}

          {!props.isLoading && props.activePanel.slug === "bulk-update" ? (
            <BulkUpdatePanel
              activeMode={props.activeBulkMode}
              fileName={props.bulkFileName}
              isActionLoading={props.isActionLoading}
              onFileChange={(event) => props.onFileSelect(event, "bulk")}
              onModeChange={props.setBulkMode}
              onSubmit={props.submitBulkUpdate}
            />
          ) : null}

          {!props.isLoading && props.activePanel.slug === "product-group" ? (
            <ProductGroupCreatePanel
              groupDiscount={props.groupDiscount}
              groupDiscountType={props.groupDiscountType}
              groupImageName={props.groupImageName}
              groupName={props.groupName}
              isActionLoading={props.isActionLoading}
              isMobileVerified={props.isMobileVerified}
              isPremium={props.isPremium}
              pricingUrl={props.pricingUrl}
              showOnHome={props.showOnHome}
              onFileChange={(event) => props.onFileSelect(event, "group")}
              onGroupDiscountChange={props.setGroupDiscount}
              onGroupDiscountTypeChange={props.setGroupDiscountType}
              onGroupNameChange={props.setGroupName}
              onShowOnHomeChange={props.setShowOnHome}
              onSubmit={props.submitProductGroupCreate}
            />
          ) : null}

          {!props.isLoading && props.activePanel.slug === "monthly-invoice" ? (
            <MonthlyInvoicePanel
              isActionLoading={props.isActionLoading}
              month={props.month}
              selectedInvoiceLabel={props.selectedInvoiceLabel}
              year={props.year}
              onMonthChange={props.setInvoiceMonth}
              onSubmit={props.submitMonthlyInvoice}
              onYearChange={props.setInvoiceYear}
            />
          ) : null}

          {!props.isLoading && props.activePanel.slug === "special-products" ? (
            <SpecialProductsPanel
              activeType={props.activeSpecialType}
              fileName={props.specialFileName}
              isActionLoading={props.isActionLoading}
              isPremium={props.isPremium}
              pricingUrl={props.pricingUrl}
              onFileChange={(event) => props.onFileSelect(event, "special")}
              onRemove={props.submitSpecialRemove}
              onTypeChange={props.setSpecialType}
              onUpload={props.submitSpecialUpload}
            />
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
              Recent product groups
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Keep activity and product-group management connected instead of
              bouncing through unrelated pages.
            </p>

            <div className="mt-5 space-y-3">
              {props.groups.length ? (
                props.groups.map((group) => (
                  <Link
                    className="block rounded-sm border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-white/20"
                    href={`/product-groups/${group?.id || group?.groupId || ""}`}
                    key={group?.id || group?.groupId}
                  >
                    <p className="text-sm font-semibold text-brand-white">
                      {group?.name || group?.title || "Product Group"}
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                      {group?.discount
                        ? `Discount ${group.discount}`
                        : "No saved discount metadata"}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/45">
                  No product groups yet.
                </div>
              )}
            </div>

            <Link
              className="mt-5 inline-flex min-h-10 items-center rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white"
              href="/product-groups"
            >
              Open product groups
            </Link>
          </section>

          <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
              Flow notes
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
              <li>Bulk update keeps product vs variation mode in the URL.</li>
              <li>Special uploads keep the selected promo type in the URL.</li>
              <li>Invoice month and year stay shareable for finance follow-up.</li>
              <li>Product group creation respects premium and mobile checks from Flutter.</li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function MetaCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
