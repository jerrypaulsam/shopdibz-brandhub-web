import Image from "next/image";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
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
    message,
    isLoading,
    isSubmitting,
    updateField,
    submitInfo,
    submitLogo,
    submitSizeChart,
    submitTheme,
  } = useStoreInfoForm();

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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_360px]">
            <div className="space-y-6">
              <StoreSection
                title="Store Identity"
                subtitle="Update the customer-facing identity, profile assets, and descriptive content for your brand."
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
                  <StoreField label="Store ID" value={form.storeUrl} helper="Example: mystore, fashionstore, etc." onChange={(value) => updateField("storeUrl", value)} />
                  <StoreField label="Store Email" type="email" value={form.storeEmail} onChange={(value) => updateField("storeEmail", value)} />
                  <StoreField label="Description" multiline maxLength={1000} value={form.storeDescription} onChange={(value) => updateField("storeDescription", value)} />
                  <StoreField label="Contact No." type="tel" value={form.contactNo} onChange={(value) => updateField("contactNo", value)} />
                  <StoreField label="Store Video" helper="Enter YouTube Video ID or full YouTube URL" value={form.storeVideo} onChange={(value) => updateField("storeVideo", value)} />
                </div>
              </StoreSection>

              <StoreSection title="Address & Social" subtitle="Configure pickup location and social discovery details.">
                <div className="grid gap-5 md:grid-cols-2">
                  <StoreField label="Store Address" value={form.storeAddress} onChange={(value) => updateField("storeAddress", value)} />
                  <StoreField label="City" value={form.storeCity} onChange={(value) => updateField("storeCity", value)} />
                  <StoreField label="State" value={form.storeState} onChange={(value) => updateField("storeState", value)} />
                  <StoreField label="Pincode" type="tel" value={form.storePinCode} onChange={(value) => updateField("storePinCode", value)} />
                  <StoreField label="ScrapItt Username" value={form.link1} onChange={(value) => updateField("link1", value)} />
                  <StoreField label="Instagram Username" value={form.link2} onChange={(value) => updateField("link2", value)} />
                </div>
              </StoreSection>

              <StoreSection title="Fulfillment & Permissions">
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
              </StoreSection>

              <StoreSection title="Update Store Theme" subtitle="Premium theme options mirrored from the Flutter store theme selector.">
                <ThemePicker
                  value={form.themeId}
                  onChange={(value) => updateField("themeId", value)}
                />
                <div className="mt-5 max-w-xs">
                  <AuthButton type="button" disabled={isSubmitting} onClick={submitTheme}>
                    {isSubmitting ? "Updating..." : "Update Theme"}
                  </AuthButton>
                </div>
              </StoreSection>
            </div>

            <div className="space-y-6">
              <StoreSection title="Assets & Quick Actions">
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

                  <button
                    className="rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white"
                    type="button"
                    disabled={isSubmitting}
                    onClick={submitSizeChart}
                  >
                    Confirm Size Chart
                  </button>

                  <a
                    className="block text-sm font-bold text-brand-gold hover:text-brand-white"
                    href={storeInfo?.url ? `https://www.shopdibz.com/store/${storeInfo.url}?utm_source=brand_hub&utm_medium=organic&utm_content=${storeInfo.url}` : "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View My Store
                  </a>
                </div>
              </StoreSection>

              <StoreSection title="Connect Your Store">
                <div className="space-y-4 text-sm leading-6 text-white/60">
                  <p>Connecting Shopify or WooCommerce enables inventory and price sync.</p>
                  <p>Enter the required credentials, complete platform setup, then sync products.</p>
                  <p>Use matching SKU codes across Shopdibz and your external store.</p>
                  <p>TODO: Convert Shopify and WooCommerce credential panels and sync actions.</p>
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
