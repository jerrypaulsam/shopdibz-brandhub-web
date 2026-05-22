import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import CollapsibleStoreSection from "@/src/components/store/CollapsibleStoreSection";
import FounderWelcomeSection from "@/src/components/store/FounderWelcomeSection";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import StoreToggleRow from "@/src/components/store/StoreToggleRow";
import ThemePicker from "@/src/components/store/ThemePicker";
import { STORE_INFO_FIELD_LIMITS, useStoreInfoForm } from "@/src/hooks/store/useStoreInfoForm";
import { getPaymentsPricingUrl } from "@/src/utils/payments";

export default function StoreInfoFormPage() {
  const router = useRouter();
  const [logoCropFile, setLogoCropFile] = useState(null);
  const {
    form,
    storeInfo,
    logoPreview,
    setLogoPreview,
    logoBase64,
    setLogoBase64,
    sizeChartPreview,
    setSizeChartPreview,
    sizeChartBase64,
    setSizeChartBase64,
    sizeChartFilename,
    setSizeChartFilename,
    connectorForm,
    message,
    fieldErrors,
    isLoading,
    isSubmitting,
    updateField,
    updateConnectorField,
    submitInfo,
    submitLogo,
    submitSizeChart,
    removeSizeChart,
    submitWelcomeMessage,
    removeWelcomeMessage,
    submitTheme,
    submitShopifyConnection,
    submitShopifySync,
    submitShopifyDisconnect,
    submitWooCommerceConnection,
    submitWooCommerceSync,
    submitWooCommerceDisconnect,
  } = useStoreInfoForm();

  const storeConnected = String(storeInfo?.storeConnected || "");
  const shopifyConnected = storeConnected === "1";
  const wooCommerceConnected = storeConnected === "2";
  const showShopifyConnector = !wooCommerceConnected;
  const showWooCommerceConnector = !shopifyConnected;
  const lastSyncedLabel = formatSyncDate(storeInfo?.lastSynced || storeInfo?.last_synced || "");
  const hasSavedStoreUrl = Boolean(String(storeInfo?.url || "").trim());
  const isInitialSetup = !hasSavedStoreUrl;
  const focusSection =
    typeof router.query.section === "string" ? router.query.section : "";

  async function fileToBase64(file, onPreview, onBase64) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      onPreview(result);
      onBase64(result.split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitInfo();
  }

  const hasPendingLogo = Boolean(logoBase64);
  const hasPendingSizeChart = Boolean(sizeChartBase64);
  const currentSizeGuide = storeInfo?.sizeGuide || "";
  const currentSizeGuideIsPdf = isPdfAsset(currentSizeGuide);
  const pendingSizeGuideIsPdf = isPdfAsset(sizeChartPreview || sizeChartFilename);
  const welcomeAudioUrl = storeInfo?.welcome || storeInfo?.welcomeVoice || "";
  const isPremiumThemeAccess = Boolean(storeInfo?.prem);
  const pricingUrl = getPaymentsPricingUrl(storeInfo);

  return (
    <AuthShell title="Store Information">
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,760px)_340px]">
            <div className="space-y-6">
              <CollapsibleStoreSection
                title="Store Identity"
                subtitle="Update your store name, logo, and brand details customers will see."
                badge={isInitialSetup ? "Setup" : "Live"}
                defaultOpen={!focusSection || focusSection === "identity"}
              >
                <div className="flex flex-col items-center gap-5">
                  <label className="cursor-pointer">
                    <span className="relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-white/10">
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Store logo preview"
                          fill
                          sizes="120px"
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-sm text-white/45">Upload logo</span>
                      )}
                    </span>
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (file) {
                          setLogoCropFile(file);
                        }
                      }}
                    />
                  </label>
                  {hasPendingLogo ? (
                    <button
                      className="cursor-pointer rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
                      type="button"
                      disabled={isSubmitting}
                      onClick={submitLogo}
                    >
                      {isSubmitting ? "Updating..." : "Confirm Logo"}
                    </button>
                  ) : null}
                  {hasPendingLogo ? (
                    <p className="text-center text-xs text-brand-gold">
                      New logo selected. Confirm to upload it to your store.
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 grid gap-5">
                  <StoreField label="Store Name" maxLength={STORE_INFO_FIELD_LIMITS.storeName} value={form.storeName} error={fieldErrors.storeName} onChange={(value) => updateField("storeName", value)} />
                  {isInitialSetup ? (
                    <StoreField label="Store ID" maxLength={STORE_INFO_FIELD_LIMITS.storeUrl} value={form.storeUrl} helper="Example: mystore, fashionstore, etc." error={fieldErrors.storeUrl} onChange={(value) => updateField("storeUrl", value)} />
                  ) : null}
                  <StoreField label="Store Email" type="email" maxLength={STORE_INFO_FIELD_LIMITS.storeEmail} value={form.storeEmail} error={fieldErrors.storeEmail} onChange={(value) => updateField("storeEmail", value)} />
                  <StoreField label="Description" multiline maxLength={STORE_INFO_FIELD_LIMITS.storeDescription} value={form.storeDescription} error={fieldErrors.storeDescription} onChange={(value) => updateField("storeDescription", value)} />
                  <label className="block">
                    <span className="text-sm font-semibold text-white/80">Contact No.</span>
                    <div className={`mt-3 flex items-center overflow-hidden rounded-[15px] border bg-transparent ${fieldErrors.contactNo ? "border-red-400/70" : "border-white/15"}`}>
                      <span className="border-r border-white/10 px-4 py-3 text-base font-semibold text-white/60">
                        +91
                      </span>
                      <input
                        className="w-full bg-transparent px-4 py-3 text-base text-brand-white outline-none placeholder:text-white/25"
                        type="tel"
                        inputMode="numeric"
                        maxLength={STORE_INFO_FIELD_LIMITS.contactNo}
                        value={form.contactNo}
                        placeholder="10 digit mobile number"
                        onChange={(event) => updateField("contactNo", event.target.value)}
                      />
                    </div>
                    {fieldErrors.contactNo ? (
                      <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.contactNo}</p>
                    ) : (
                      <p className="mt-2 text-xs text-white/40">Saved with +91 automatically.</p>
                    )}
                  </label>
                  <StoreField label="Store Video" maxLength={STORE_INFO_FIELD_LIMITS.storeVideo} helper="Enter YouTube Video ID or full YouTube URL" value={form.storeVideo} error={fieldErrors.storeVideo} onChange={(value) => updateField("storeVideo", value)} />
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Address & Social"
                subtitle="Keep your address and social details up to date."
                badge={isInitialSetup ? "Required" : "Optional"}
                defaultOpen={!focusSection ? isInitialSetup : focusSection === "address"}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {isInitialSetup ? (
                    <>
                      <StoreField label="Store Address" maxLength={STORE_INFO_FIELD_LIMITS.storeAddress} value={form.storeAddress} error={fieldErrors.storeAddress} onChange={(value) => updateField("storeAddress", value)} />
                      <StoreField label="City" maxLength={STORE_INFO_FIELD_LIMITS.storeCity} value={form.storeCity} error={fieldErrors.storeCity} onChange={(value) => updateField("storeCity", value)} />
                      <StoreField label="State" maxLength={STORE_INFO_FIELD_LIMITS.storeState} value={form.storeState} error={fieldErrors.storeState} onChange={(value) => updateField("storeState", value)} />
                      <StoreField label="Pincode" type="tel" value={form.storePinCode} error={fieldErrors.storePinCode} onChange={(value) => updateField("storePinCode", value)} />
                    </>
                  ) : null}
                  <StoreField
                    label="ScrapItt Username"
                    helper="Optional. Use only letters, numbers, periods, and underscores. Do not start with @."
                    maxLength={STORE_INFO_FIELD_LIMITS.link1}
                    value={form.link1}
                    error={fieldErrors.link1}
                    onChange={(value) => updateField("link1", value)}
                  />
                  <StoreField
                    label="Instagram Username"
                    helper="Optional. Use only letters, numbers, periods, and underscores. Do not start with @."
                    maxLength={STORE_INFO_FIELD_LIMITS.link2}
                    value={form.link2}
                    error={fieldErrors.link2}
                    onChange={(value) => updateField("link2", value)}
                  />
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Fulfillment & Permissions"
                subtitle="Manage shipping preferences and store settings."
                defaultOpen={!focusSection || focusSection === "fulfillment"}
              >
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/80">Choose Shipping Method</span>
                    <select
                      className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
                      value={form.shipType}
                      onChange={(event) => updateField("shipType", event.target.value)}
                    >
                      <option className="bg-black" value="SE">Self Ship</option>
                      <option className="bg-black" value="AS">Assisted Ship</option>
                    </select>
                  </label>

                  {form.shipType === "AS" ? (
                    <label className="block">
                      <span className="text-sm font-semibold text-white/80">Choose Shipping Mode</span>
                      <select
                        className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
                        value={form.shipMode}
                        onChange={(event) => updateField("shipMode", event.target.value)}
                      >
                        <option className="bg-black" value="0">Air</option>
                        <option className="bg-black" value="1">Surface</option>
                      </select>
                    </label>
                  ) : null}

                  <StoreToggleRow
                    label="Enable Reselling"
                    checked={form.enableReselling}
                    helper="Read and accept your reseller-permission terms before turning this on."
                    onChange={(value) => updateField("enableReselling", value)}
                  />
                  <StoreToggleRow
                    label="Activate your store"
                    checked={form.activateStore}
                    helper="If you activate now, customers can see your store immediately."
                    onChange={(value) => updateField("activateStore", value)}
                  />
                </div>
              </CollapsibleStoreSection>

              {hasSavedStoreUrl ? (
                <>
                  <CollapsibleStoreSection
                    title="Store Theme"
                    subtitle={
                      isPremiumThemeAccess
                        ? "Choose the storefront theme that best matches your brand."
                        : "Premium storefront themes are available after you upgrade your plan."
                    }
                    defaultOpen={focusSection === "theme"}
                  >
                    <div className="relative">
                      <div className={!isPremiumThemeAccess ? "pointer-events-none select-none blur-[3px] opacity-50" : ""}>
                        <ThemePicker
                          value={form.themeId}
                          onChange={(value) => updateField("themeId", value)}
                        />
                        <div className="mt-5 max-w-xs">
                          <AuthButton type="button" disabled={isSubmitting || !isPremiumThemeAccess} onClick={submitTheme}>
                            {isSubmitting ? "Updating..." : "Update Theme"}
                          </AuthButton>
                        </div>
                      </div>

                      {!isPremiumThemeAccess ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="theme-home-card w-full max-w-md rounded-sm border border-brand-gold/25 px-5 py-5 text-center shadow-2xl">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                              Premium Feature
                            </p>
                            <p className="theme-text-muted mt-3 text-sm leading-6">
                              Upgrade your plan to unlock storefront theme customization.
                            </p>
                            {pricingUrl ? (
                              <Link
                                className="theme-action-accent mt-4 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-bold transition-colors"
                                href={pricingUrl}
                              >
                                Upgrade plan
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CollapsibleStoreSection>

                  <CollapsibleStoreSection
                    title="Size Chart & Storefront Assets"
                    subtitle="Update your size guide and storefront assets in one place."
                    defaultOpen={focusSection === "assets"}
                  >
                    <div className="space-y-5">
                      <label className="block">
                        <span className="text-sm font-semibold text-white/80">Update Size Chart</span>
                        <input
                          className="mt-3 block w-full text-sm text-white/65 file:mr-4 file:rounded-sm file:border-0 file:bg-brand-gold file:px-4 file:py-2 file:font-bold file:text-brand-black"
                          type="file"
                          accept="image/*,.pdf,application/pdf"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            if (file) {
                              setSizeChartFilename(file.name || "");
                              fileToBase64(file, setSizeChartPreview, setSizeChartBase64);
                            }
                          }}
                        />
                      </label>

                      {sizeChartPreview && !pendingSizeGuideIsPdf ? (
                        <div className="relative h-56 overflow-hidden rounded-sm border border-white/10 bg-white">
                          <Image
                            src={sizeChartPreview}
                            alt="Size chart preview"
                            fill
                            sizes="320px"
                            className="object-contain"
                          />
                        </div>
                      ) : sizeChartPreview && pendingSizeGuideIsPdf ? (
                        <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-5 text-sm text-white/65">
                          PDF selected and ready to upload.
                        </div>
                      ) : currentSizeGuide && !currentSizeGuideIsPdf ? (
                        <div className="relative h-56 overflow-hidden rounded-sm border border-white/10 bg-white">
                          <Image
                            src={currentSizeGuide}
                            alt="Current size guide"
                            fill
                            sizes="320px"
                            className="object-contain"
                          />
                        </div>
                      ) : currentSizeGuide && currentSizeGuideIsPdf ? (
                        <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-5 text-sm text-white/65">
                          A PDF size guide is currently attached to this store.
                        </div>
                      ) : null}

                      <div className="flex flex-wrap gap-3">
                        {hasPendingSizeChart ? (
                          <button
                            className="cursor-pointer rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            disabled={isSubmitting}
                            onClick={submitSizeChart}
                          >
                            {isSubmitting ? "Updating..." : "Confirm Size Guide"}
                          </button>
                        ) : null}

                        {currentSizeGuide ? (
                          <a
                            className="inline-flex items-center rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white hover:text-brand-gold"
                            href={currentSizeGuide}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Preview Size Guide
                          </a>
                        ) : null}

                        {currentSizeGuide && !hasPendingSizeChart ? (
                          <button
                            className="inline-flex items-center rounded-sm border border-red-400/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-200 transition-colors hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            disabled={isSubmitting}
                            onClick={removeSizeChart}
                          >
                            {isSubmitting ? "Removing..." : "Remove Size Guide"}
                          </button>
                        ) : null}
                      </div>
                      {hasPendingSizeChart ? (
                        <p className="text-xs text-brand-gold">
                          New size guide selected. Confirm to upload it to your store.
                        </p>
                      ) : null}
                    </div>
                  </CollapsibleStoreSection>

                  <FounderWelcomeSection
                    audioUrl={welcomeAudioUrl}
                    isSubmitting={isSubmitting}
                    onUpload={submitWelcomeMessage}
                    onDelete={removeWelcomeMessage}
                  />

                  <CollapsibleStoreSection
                    title="External Store Sync"
                    subtitle="Connect Shopify or WooCommerce to sync products and pricing."
                    defaultOpen={focusSection === "sync"}
                  >
                    <div className="space-y-6">
                      <div className="theme-surface rounded-[22px] border p-5">
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-2xl">
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                                Choose One Integration
                              </p>
                              <h3 className="mt-2 text-xl font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
                                Sync with Shopify or WooCommerce
                              </h3>
                              <div className="theme-text-muted mt-3 space-y-2 text-sm leading-6">
                                <p>Connect one external storefront to keep inventory and pricing aligned with Shopdibz.</p>
                                <p>Enter the required credentials, finish the platform setup, then run your first sync.</p>
                                <p>Use matching SKU codes across Shopdibz and your external store for the cleanest sync.</p>
                              </div>
                            </div>
                            <div className="theme-surface-soft inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                              One platform at a time
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <ConnectorSummaryCard
                              provider="shopify"
                              title="Shopify"
                              description="Best for stores already running on Shopify."
                              status={shopifyConnected ? "Connected" : wooCommerceConnected ? "Unavailable" : "Ready to connect"}
                            />
                            <ConnectorSummaryCard
                              provider="woocommerce"
                              title="WooCommerce"
                              description="Ideal for WordPress stores using WooCommerce."
                              status={wooCommerceConnected ? "Connected" : shopifyConnected ? "Unavailable" : "Ready to connect"}
                            />
                          </div>
                        </div>
                      </div>

                      {showShopifyConnector ? (
                        <ConnectorBlock
                          provider="shopify"
                          title="Shopify"
                          description={
                            shopifyConnected
                              ? "Connected"
                              : "Connect your Shopify store and enable sync."
                          }
                          connected={shopifyConnected}
                          connectFields={
                            <>
                              <StoreField label="Shopify Store URL" helper="Enter only the store subdomain, without .myshopify.com" value={connectorForm.shopifyUrl} onChange={(value) => updateConnectorField("shopifyUrl", value)} />
                              <StoreField label="Shopify Access Token" value={connectorForm.shopifyAccess} onChange={(value) => updateConnectorField("shopifyAccess", value)} />
                            </>
                          }
                          connectLabel={isSubmitting ? "Saving..." : "Connect Shopify"}
                          onConnect={submitShopifyConnection}
                          syncLabel="Sync Shopify"
                          onSync={submitShopifySync}
                          onDisconnect={submitShopifyDisconnect}
                          isSubmitting={isSubmitting}
                          lastSyncedLabel={lastSyncedLabel}
                          tutorialUrl="https://www.youtube.com/watch?v=v_rqyBDTTQU"
                        />
                      ) : null}

                      {showWooCommerceConnector ? (
                        <ConnectorBlock
                          provider="woocommerce"
                          title="WooCommerce"
                          description={
                            wooCommerceConnected
                              ? "Connected"
                              : "Connect your WooCommerce store and start syncing products."
                          }
                          connected={wooCommerceConnected}
                          connectFields={
                            <>
                              <StoreField label="WooCommerce Store URL" value={connectorForm.wooCommerceUrl} onChange={(value) => updateConnectorField("wooCommerceUrl", value)} />
                              <StoreField label="WooCommerce Consumer Key" value={connectorForm.wooCommerceKey} onChange={(value) => updateConnectorField("wooCommerceKey", value)} />
                              <StoreField label="WooCommerce Consumer Secret" value={connectorForm.wooCommerceSecret} onChange={(value) => updateConnectorField("wooCommerceSecret", value)} />
                            </>
                          }
                          connectLabel={isSubmitting ? "Saving..." : "Connect WooCommerce"}
                          onConnect={submitWooCommerceConnection}
                          syncLabel="Sync WooCommerce"
                          onSync={submitWooCommerceSync}
                          onDisconnect={submitWooCommerceDisconnect}
                          isSubmitting={isSubmitting}
                          lastSyncedLabel={lastSyncedLabel}
                          tutorialUrl="https://drive.google.com/file/d/1Cx3GwUuPMpoa9t2NcNIPc6kPmEbOVjHb/view?usp=sharing"
                        />
                      ) : null}
                    </div>
                  </CollapsibleStoreSection>
                </>
              ) : null}
            </div>

            <div className="space-y-6">
              <StoreSection title="Store Status">
                <div className="space-y-5">
                  <StatusRow label="Mode" value={isInitialSetup ? "Initial Setup" : "Live Store Settings"} />
                  <StatusRow label="Shipping" value={form.shipType === "AS" ? "Assisted Shipping" : "Self Ship"} />
                  <StatusRow label="Reselling" value={form.enableReselling ? "Enabled" : "Disabled"} />
                  <StatusRow label="Store Visibility" value={form.activateStore ? "Active" : "Inactive"} />
                  <StatusRow label="Theme" value={`Theme ${form.themeId || "0"}`} />
                </div>
              </StoreSection>

              <StoreSection title="Editing Guidance">
                <div className="space-y-4 text-sm leading-6 text-white/60">
                  <p>Keep your store name, logo, and contact details current so customers can trust your brand.</p>
                  <p>Review shipping and sync settings carefully before turning them on for your live store.</p>
                  <p>Update key assets like your size guide and welcome message whenever your store changes.</p>
                </div>
              </StoreSection>
            </div>
          </div>

          <AuthMessage>{message}</AuthMessage>

          <div className="max-w-xs">
            <AuthButton disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Updating..." : isLoading ? "Loading..." : "Update"}
            </AuthButton>
          </div>
        </form>
      </div>
      <AspectCropDialog
        open={Boolean(logoCropFile)}
        file={logoCropFile}
        title="Crop Store Logo"
        aspectRatio={1}
        outputWidth={1080}
        shape="circle"
        onCancel={() => setLogoCropFile(null)}
        onConfirm={({ dataUrl, base64 }) => {
          setLogoPreview(dataUrl);
          setLogoBase64(base64);
          setLogoCropFile(null);
        }}
      />
    </AuthShell>
  );
}

function isPdfAsset(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return false;
  }

  if (/^data:application\/pdf(?:;|,)/i.test(normalized)) {
    return true;
  }

  if (/\.pdf(?:\?|#|$)/i.test(normalized)) {
    return true;
  }

  try {
    const parsed = new URL(normalized);
    return /\.pdf$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

/**
 * @param {{ label: string, value: string }} props
 */
function StatusRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-brand-white">
        {value}
      </span>
    </div>
  );
}

/**
 * @param {{
 * provider: "shopify" | "woocommerce",
 * title: string,
 * description: string,
 * connected: boolean,
 * connectFields: import("react").ReactNode,
 * connectLabel: string,
 * disabledReason?: string,
 * syncLabel: string,
 * onConnect: () => Promise<void>,
 * onSync: () => Promise<void>,
 * onDisconnect: () => Promise<void>,
 * isSubmitting: boolean,
 * lastSyncedLabel?: string,
 * tutorialUrl?: string,
 * }} props
 */
function ConnectorBlock({
  provider,
  title,
  description,
  connected,
  connectFields,
  connectLabel,
  disabledReason = "",
  syncLabel,
  onConnect,
  onSync,
  onDisconnect,
  isSubmitting,
  lastSyncedLabel = "",
  tutorialUrl = "",
}) {
  const accentClasses =
    provider === "shopify"
      ? {
          ring: "border-[#95BF47]/28 [html[data-theme='light']_&]:border-[#3c6c1e]/24",
          status: "border-[#95BF47]/30 bg-[#95BF47]/10 text-[#dff5b6] [html[data-theme='light']_&]:border-[#95BF47]/35 [html[data-theme='light']_&]:bg-[#95BF47]/14 [html[data-theme='light']_&]:text-[#35591e]",
        }
      : {
          ring: "border-[#7F54B3]/28 [html[data-theme='light']_&]:border-[#64418c]/24",
          status: "border-[#7F54B3]/30 bg-[#7F54B3]/10 text-[#e9ddfb] [html[data-theme='light']_&]:border-[#7F54B3]/35 [html[data-theme='light']_&]:bg-[#7F54B3]/14 [html[data-theme='light']_&]:text-[#4f3272]",
        };

  return (
    <div className={`theme-surface rounded-[22px] border p-5 ${connected ? accentClasses.ring : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="theme-surface-soft flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border">
            <ProviderLogo provider={provider} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">{title}</h3>
            <p className="theme-text-muted mt-1 text-sm">{description}</p>
          </div>
        </div>
        <div className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${connected ? accentClasses.status : "theme-surface-soft theme-text-muted"}`}>
          {connected ? "Connected" : "Setup"}
        </div>
      </div>
      {!connected ? (
        <div className="mt-4 space-y-4">
          {disabledReason ? (
            <div className="theme-surface-soft theme-text-muted rounded-sm border px-4 py-3 text-sm">
              {disabledReason}
            </div>
          ) : (
            connectFields
          )}
          {tutorialUrl ? (
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-sm border border-brand-gold/40 bg-brand-gold px-4 text-sm font-extrabold text-brand-black transition-colors hover:border-brand-white hover:bg-brand-white"
              href={tutorialUrl}
              target="_blank"
              rel="noreferrer"
            >
              View Tutorial
            </a>
          ) : null}
          {!disabledReason ? (
            <div className="max-w-xs">
              <AuthButton type="button" disabled={isSubmitting} onClick={onConnect}>
                {connectLabel}
              </AuthButton>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {lastSyncedLabel ? (
            <p className="theme-text-muted text-xs font-semibold">
              Last synced: {lastSyncedLabel}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-sm border border-brand-gold/40 bg-brand-gold px-4 py-2 text-sm font-extrabold text-brand-black transition-colors hover:border-brand-white hover:bg-brand-white disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={onSync}
            >
              {syncLabel}
            </button>
            {tutorialUrl ? (
              <a
                className="inline-flex items-center rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                href={tutorialUrl}
                target="_blank"
                rel="noreferrer"
              >
                Tutorial
              </a>
            ) : null}
            <button
              className="rounded-sm border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @param {{
 * provider: "shopify" | "woocommerce",
 * title: string,
 * description: string,
 * status: string,
 * }} props
 */
function ConnectorSummaryCard({ provider, title, description, status }) {
  const palette =
    provider === "shopify"
      ? {
          surface: "border-[#95BF47]/22 bg-[linear-gradient(135deg,rgba(149,191,71,0.12),rgba(149,191,71,0.03))] [html[data-theme='light']_&]:border-[#3c6c1e]/20 [html[data-theme='light']_&]:bg-[linear-gradient(135deg,rgba(149,191,71,0.12),rgba(149,191,71,0.04))]",
          status: "text-[#dff5b6] [html[data-theme='light']_&]:text-[#35591e]",
        }
      : {
          surface: "border-[#7F54B3]/22 bg-[linear-gradient(135deg,rgba(127,84,179,0.12),rgba(127,84,179,0.03))] [html[data-theme='light']_&]:border-[#64418c]/20 [html[data-theme='light']_&]:bg-[linear-gradient(135deg,rgba(127,84,179,0.12),rgba(127,84,179,0.04))]",
          status: "text-[#f0e7ff] [html[data-theme='light']_&]:text-[#4f3272]",
        };

  return (
    <div className={`rounded-[20px] border p-4 ${palette.surface}`}>
      <div className="flex items-start gap-4">
        <div className="theme-surface flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border">
          <ProviderLogo provider={provider} />
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">{title}</h4>
          <span className={`mt-1 block text-xs font-bold uppercase tracking-[0.14em] ${palette.status}`}>
            {status}
          </span>
          <p className="theme-text-muted mt-2 text-sm leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{ provider: "shopify" | "woocommerce" }} props
 */
function ProviderLogo({ provider }) {
  if (provider === "shopify") {
    return (
      <svg
        aria-hidden="true"
        className="h-8 w-8"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="9" y="11" width="46" height="42" rx="12" fill="#95BF47" />
        <path d="M24 24.5H40L38 45H26L24 24.5Z" fill="white" />
        <path d="M27 24C27 20.962 29.462 18.5 32.5 18.5C35.538 18.5 38 20.962 38 24" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M29 31.5C29 29.79 30.343 28.5 32.5 28.5C34.346 28.5 35.653 29.224 36.639 30.147" stroke="#95BF47" strokeWidth="3" strokeLinecap="round" />
        <path d="M35.5 33.5C35.5 37.091 32.757 39.5 29.5 39.5" stroke="#95BF47" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="23" fill="#7F54B3" />
      <path d="M18.5 23.5L24 40L29.5 27L35 40L40.5 23.5L45.5 40.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatSyncDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
