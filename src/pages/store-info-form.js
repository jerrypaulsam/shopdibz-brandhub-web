import Image from "next/image";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import CollapsibleStoreSection from "@/src/components/store/CollapsibleStoreSection";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import StoreToggleRow from "@/src/components/store/StoreToggleRow";
import ThemePicker from "@/src/components/store/ThemePicker";
import { useStoreInfoForm } from "@/src/hooks/store/useStoreInfoForm";

export default function StoreInfoFormPage() {
  const {
    form,
    storeInfo,
    logoPreview,
    setLogoPreview,
    setLogoBase64,
    sizeChartPreview,
    setSizeChartPreview,
    setSizeChartBase64,
    connectorForm,
    message,
    isLoading,
    isSubmitting,
    updateField,
    updateConnectorField,
    submitInfo,
    submitLogo,
    submitSizeChart,
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
  const isInitialSetup = !storeInfo;

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
                defaultOpen
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
                        if (file) {
                          fileToBase64(file, setLogoPreview, setLogoBase64);
                        }
                      }}
                    />
                  </label>
                  <button
                    className="rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white"
                    type="button"
                    disabled={isSubmitting}
                    onClick={submitLogo}
                  >
                    Confirm Logo
                  </button>
                </div>

                <div className="mt-8 grid gap-5">
                  <StoreField label="Store Name" value={form.storeName} onChange={(value) => updateField("storeName", value)} />
                  {isInitialSetup ? (
                    <StoreField label="Store ID" value={form.storeUrl} helper="Example: mystore, fashionstore, etc." onChange={(value) => updateField("storeUrl", value)} />
                  ) : null}
                  <StoreField label="Store Email" type="email" value={form.storeEmail} onChange={(value) => updateField("storeEmail", value)} />
                  <StoreField label="Description" multiline maxLength={1000} value={form.storeDescription} onChange={(value) => updateField("storeDescription", value)} />
                  <StoreField label="Contact No." type="tel" value={form.contactNo} onChange={(value) => updateField("contactNo", value)} />
                  <StoreField label="Store Video" helper="Enter YouTube Video ID or full YouTube URL" value={form.storeVideo} onChange={(value) => updateField("storeVideo", value)} />
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Address & Social"
                subtitle="Configure pickup location and social discovery details."
                badge={isInitialSetup ? "Required" : "Optional"}
                defaultOpen={isInitialSetup}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {isInitialSetup ? (
                    <>
                      <StoreField label="Store Address" value={form.storeAddress} onChange={(value) => updateField("storeAddress", value)} />
                      <StoreField label="City" value={form.storeCity} onChange={(value) => updateField("storeCity", value)} />
                      <StoreField label="State" value={form.storeState} onChange={(value) => updateField("storeState", value)} />
                      <StoreField label="Pincode" type="tel" value={form.storePinCode} onChange={(value) => updateField("storePinCode", value)} />
                    </>
                  ) : null}
                  <StoreField label="ScrapItt Username" value={form.link1} onChange={(value) => updateField("link1", value)} />
                  <StoreField label="Instagram Username" value={form.link2} onChange={(value) => updateField("link2", value)} />
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Fulfillment & Permissions"
                subtitle="Shipping choices and seller-side operating controls."
                defaultOpen
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
                subtitle="Premium theme options mirrored from the Flutter selector, but organised for web."
              >
                <ThemePicker
                  value={form.themeId}
                  onChange={(value) => updateField("themeId", value)}
                />
                <div className="mt-5 max-w-xs">
                  <AuthButton type="button" disabled={isSubmitting} onClick={submitTheme}>
                    {isSubmitting ? "Updating..." : "Update Theme"}
                  </AuthButton>
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="Size Chart & Storefront Assets"
                subtitle="Keep customer-facing brand assets updated without burying them inside the main form."
              >
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/80">Update Size Chart</span>
                    <input
                      className="mt-3 block w-full text-sm text-white/65 file:mr-4 file:rounded-sm file:border-0 file:bg-brand-gold file:px-4 file:py-2 file:font-bold file:text-brand-black"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          fileToBase64(file, setSizeChartPreview, setSizeChartBase64);
                        }
                      }}
                    />
                  </label>

                  {sizeChartPreview ? (
                    <div className="relative h-56 overflow-hidden rounded-sm border border-white/10 bg-white">
                      <Image
                        src={sizeChartPreview}
                        alt="Size chart preview"
                        fill
                        sizes="320px"
                        className="object-contain"
                      />
                    </div>
                  ) : storeInfo?.sizeGuide ? (
                    <div className="relative h-56 overflow-hidden rounded-sm border border-white/10 bg-white">
                      <Image
                        src={storeInfo.sizeGuide}
                        alt="Current size guide"
                        fill
                        sizes="320px"
                        className="object-contain"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white"
                      type="button"
                      disabled={isSubmitting}
                      onClick={submitSizeChart}
                    >
                      Confirm Size Chart
                    </button>

                    <a
                      className="inline-flex items-center rounded-sm border border-brand-gold/30 px-4 py-2 text-sm font-bold text-brand-gold hover:text-brand-white"
                      href={storeInfo?.url ? `https://www.shopdibz.com/store/${storeInfo.url}?utm_source=brand_hub&utm_medium=organic&utm_content=${storeInfo.url}` : "#"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View My Store
                    </a>
                  </div>
                </div>
              </CollapsibleStoreSection>

              <CollapsibleStoreSection
                title="External Store Sync"
                subtitle="Connect Shopify or WooCommerce without turning the settings page into one long screen."
              >
                <div className="space-y-6">
                  <div className="space-y-2 text-sm leading-6 text-white/60">
                    <p>Connecting your Shopify or WooCommerce store enables inventory and price sync.</p>
                    <p>Enter the required credentials, complete platform setup, then sync products.</p>
                    <p>Use matching SKU codes across Shopdibz and your external store.</p>
                  </div>

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
                        <StoreField label="Shopify Store URL" value={connectorForm.shopifyUrl} onChange={(value) => updateConnectorField("shopifyUrl", value)} />
                        <StoreField label="Shopify Access Token" value={connectorForm.shopifyAccess} onChange={(value) => updateConnectorField("shopifyAccess", value)} />
                      </>
                    }
                    connectLabel={isSubmitting ? "Saving..." : "Connect Shopify"}
                    onConnect={submitShopifyConnection}
                    syncLabel="Sync Shopify"
                    onSync={submitShopifySync}
                    onDisconnect={submitShopifyDisconnect}
                    isSubmitting={isSubmitting}
                  />

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
                  />
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
                  <p>Initial setup keeps address and store ID visible because those are required to complete the original Flutter onboarding contract.</p>
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
    </DashboardShell>
  );
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
 * syncLabel: string,
 * onConnect: () => Promise<void>,
 * onSync: () => Promise<void>,
 * onDisconnect: () => Promise<void>,
 * isSubmitting: boolean,
 * }} props
 */
function ConnectorBlock({
  title,
  description,
  connected,
  connectFields,
  connectLabel,
  syncLabel,
  onConnect,
  onSync,
  onDisconnect,
  isSubmitting,
}) {
  return (
    <div className="rounded-sm border border-white/10 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-brand-white">{title}</h3>
          <p className="mt-1 text-xs text-white/45">{description}</p>
        </div>
        {connected ? (
          <div className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
            Connected
          </div>
        ) : null}
      </div>
      {!connected ? (
        <div className="mt-4 space-y-4">
          {connectFields}
          <div className="max-w-xs">
            <AuthButton type="button" disabled={isSubmitting} onClick={onConnect}>
              {connectLabel}
            </AuthButton>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white"
            type="button"
            disabled={isSubmitting}
            onClick={onSync}
          >
            {syncLabel}
          </button>
          <button
            className="rounded-sm border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300"
            type="button"
            disabled={isSubmitting}
            onClick={onDisconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
