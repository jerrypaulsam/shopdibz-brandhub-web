import Link from "next/link";
import ToastMessage from "@/src/components/app/ToastMessage";
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
 * @property {{ groupName: string, groupDiscount: string, groupImage: string }} groupFieldErrors
 * @property {string} groupDiscountType
 * @property {string} groupImageName
 * @property {string} groupName
 * @property {any[]} groups
 * @property {number} groupsCount
 * @property {boolean} isActionLoading
 * @property {boolean} isLoading
 * @property {boolean} isPremium
 * @property {string} planCode
 * @property {string} message
 * @property {string} month
 * @property {string} pricingUrl
 * @property {string} productGroupBlockedMessage
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
 * @property {(payload: { fileName: string, base64: string }) => void} setGroupImageAsset
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
      <ToastMessage message={props.message} type="error" />
      <ToastMessage message={props.actionError} type="error" />
      <ToastMessage message={props.actionMessage} type="success" />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="theme-panel rounded-sm border p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Activity
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            Seller activity
          </h1>
        </div>

        <aside className="theme-panel rounded-sm border p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Readiness
          </h2>
          <div className="mt-4 space-y-3">
            <MetaCard
              label="Store plan"
              value={props.planCode || (props.isPremium ? "Premium" : "Standard")}
            />
            <MetaCard
              label="Product groups"
              value={String(props.groupsCount)}
            />
          </div>
          {props.pricingUrl ? (
            <a
              className="theme-action-accent mt-5 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-semibold transition-colors"
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

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {props.isLoading ? (
            <div className="theme-panel rounded-sm border px-5 py-12 text-center text-sm theme-text-muted">
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
              groupFieldErrors={props.groupFieldErrors}
              groupDiscountType={props.groupDiscountType}
              groupImageName={props.groupImageName}
              groupName={props.groupName}
              isActionLoading={props.isActionLoading}
              isCreateDisabled={!props.isPremium}
              isPremium={props.isPremium}
              blockedMessage={props.productGroupBlockedMessage}
              pricingUrl={props.pricingUrl}
              showOnHome={props.showOnHome}
              onImageCropped={props.setGroupImageAsset}
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
          <section className="theme-panel rounded-sm border p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
              Recent product groups
            </h2>
            <p className="theme-text-muted mt-3 text-sm leading-6">
              Quickly review and manage your recent product groups from one place.
            </p>

            <div className="mt-5 space-y-3">
              {props.groups.length ? (
                props.groups.map((group) => (
                  <Link
                    className="theme-panel-soft block rounded-sm border px-4 py-4 transition-colors hover:border-white/20"
                    href={`/product-groups/${group?.id || group?.groupId || ""}`}
                    key={group?.id || group?.groupId}
                  >
                    <p className="text-sm font-semibold text-brand-white">
                      {group?.name || group?.title || "Product Group"}
                    </p>
                    <p className="theme-text-muted mt-2 text-sm">
                      {group?.discount
                        ? `Discount ${group.discount}`
                        : "No saved discount metadata"}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="theme-panel-soft rounded-sm border px-4 py-6 text-sm theme-text-muted">
                  No product groups yet.
                </div>
              )}
            </div>

            <Link
              className="theme-action-neutral mt-5 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-semibold transition-colors"
              href="/product-groups"
            >
              Open product groups
            </Link>
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
