import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import CollapsibleStoreSection from "@/src/components/store/CollapsibleStoreSection";
import FounderWelcomeSection from "@/src/components/store/FounderWelcomeSection";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import StoreToggleRow from "@/src/components/store/StoreToggleRow";
import ThemePicker from "@/src/components/store/ThemePicker";
import { useStoreInfoForm } from "@/src/hooks/store/useStoreInfoForm";
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
  const isInitialSetup = !storeInfo;
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
    <DashboardShell>
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,760px)_340px]">
            <div className="space-y-6">
              <CollapsibleStoreSection
                title="Store Identity"
                subtitle="Update the customer-facing identity, profile assets, and descriptive content for your brand."
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
                  <StoreField label="Store Name" value={form.storeName} error={fieldErrors.storeName} onChange={(value) => updateField("storeName", value)} />
                  {isInitialSetup ? (
                    <StoreField label="Store ID" value={form.storeUrl} helper="Example: mystore, fashionstore, etc." error={fieldErrors.storeUrl} onChange={(value) => updateField("storeUrl", value)} />
                  ) : null}
                  <StoreField label="Store Email" type="email" value={form.storeEmail} error={fieldErrors.storeEmail} onChange={(value) => updateField("storeEmail", value)} />
                  <StoreField label="Description" multiline maxLength={1000} value={form.storeDescription} error={fieldErrors.storeDescription} onChange={(value) => updateField("storeDescription", value)} />
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
                        maxLength={10}
                        value={form.contactNo}
                        placeholder="10 digit mobile number"
                        onChange={(event) => updateField("contactNo", event.target.value)}
                      />
                    </div>
                    {fieldErrors.contactNo ? (
                      <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.contactNo}</p>
                    ) : (
                      <p className="mt-2 text-xs text-white/40">Saved to the backend with +91 automatically.</p>
                    )}
                  </label>
                  <StoreField label="Store Video" helper="Enter YouTube Video ID or full YouTube URL" value={form.storeVideo} error={fieldErrors.storeVideo} onChange={(value) => updateField("storeVideo", value)} />
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Address & Social"
                subtitle="Configure pickup location and social discovery details."
                badge={isInitialSetup ? "Required" : "Optional"}
                defaultOpen={!focusSection ? isInitialSetup : focusSection === "address"}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {isInitialSetup ? (
                    <>
                      <StoreField label="Store Address" value={form.storeAddress} error={fieldErrors.storeAddress} onChange={(value) => updateField("storeAddress", value)} />
                      <StoreField label="City" value={form.storeCity} error={fieldErrors.storeCity} onChange={(value) => updateField("storeCity", value)} />
                      <StoreField label="State" value={form.storeState} error={fieldErrors.storeState} onChange={(value) => updateField("storeState", value)} />
                      <StoreField label="Pincode" type="tel" value={form.storePinCode} error={fieldErrors.storePinCode} onChange={(value) => updateField("storePinCode", value)} />
                    </>
                  ) : null}
                  <StoreField label="ScrapItt Username" value={form.link1} onChange={(value) => updateField("link1", value)} />
                  <StoreField label="Instagram Username" value={form.link2} onChange={(value) => updateField("link2", value)} />
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Fulfillment & Permissions"
                subtitle="Shipping choices and seller-side operating controls."
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
                      <div className="w-full max-w-md rounded-sm border border-brand-gold/25 bg-[#17130a]/95 px-5 py-5 text-center shadow-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                          Premium Feature
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/70">
                          Upgrade your plan to unlock storefront theme customization.
                        </p>
                        {pricingUrl ? (
                          <a
                            className="mt-4 inline-flex min-h-10 items-center rounded-sm border border-brand-gold/30 px-4 text-sm font-bold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
                            href={pricingUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Upgrade plan
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Size Chart & Storefront Assets"
                subtitle="Keep customer-facing brand assets updated without burying them inside the main form."
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

                    {/* <a
                      className="inline-flex items-center rounded-sm border border-brand-gold/30 px-4 py-2 text-sm font-bold text-brand-gold hover:text-brand-white"
                      href={storeInfo?.url ? `https://www.shopdibz.com/store/${storeInfo.url}?utm_source=brand_hub&utm_medium=organic&utm_content=${storeInfo.url}` : "#"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View My Store
                    </a> */}
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
                subtitle="Connect Shopify or WooCommerce without turning the settings page into one long screen."
                defaultOpen={focusSection === "sync"}
              >
                <div className="space-y-6">
                  <div className="space-y-2 text-sm leading-6 text-white/60">
                    <p>Connecting your Shopify or WooCommerce store enables inventory and price sync.</p>
                    <p>Enter the required credentials, complete platform setup, then sync products.</p>
                    <p>Use matching SKU codes across Shopdibz and your external store.</p>
                  </div>

                  {showShopifyConnector ? (
                    <ConnectorBlock
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
                  <p>Core storefront settings are grouped to make repeated updates quicker on desktop and mobile.</p>
                  <p>Initial setup keeps address and store ID visible because those details are required to complete store activation.</p>
                  <p>Later edits keep those setup-only fields tucked away so the seller is not forced through the same long form every time.</p>
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
    </DashboardShell>
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
  return (
    <div className={`rounded-sm border p-4 ${connected ? "border-emerald-400/25 bg-emerald-950/10" : "border-white/10"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-brand-white">{title}</h3>
          <p className="mt-1 text-xs text-white/45">{description}</p>
        </div>
        {connected ? (
          <div className="w-fit rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
            Connected
          </div>
        ) : null}
      </div>
      {!connected ? (
        <div className="mt-4 space-y-4">
          {disabledReason ? (
            <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
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
            <p className="text-xs font-semibold text-white/45">
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
