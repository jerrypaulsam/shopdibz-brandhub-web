/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ storeInfo: any }} props
 */
export function StoreSettingsSection({ storeInfo }) {
  return (
    <StoreSection title="Store Settings">
      <div className="space-y-4 text-sm">
        <InfoRow label="Store Name" value={storeInfo?.name || "---"} />
        <InfoRow label="Store URL" value={storeInfo?.url ? `@${storeInfo.url}` : "---"} />
        <InfoRow label="GSTIN" value={storeInfo?.tin || "---"} />
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/35">Description</p>
          <p className="mt-2 leading-6 text-white/75">{storeInfo?.description || "---"}</p>
        </div>
        <div className="pt-2">
          <Link
            className="text-sm font-bold text-brand-gold hover:text-brand-white"
            href="/store-info-form"
          >
            Edit Store Information
          </Link>
        </div>
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ bannerImages: any[] }} props
 */
export function StoreSlidersSection({ bannerImages }) {
  const desktopCount = bannerImages.filter(
    (item) => !(item?.for_mobile ?? item?.forMobile),
  ).length;
  const mobileCount = bannerImages.filter(
    (item) => Boolean(item?.for_mobile ?? item?.forMobile),
  ).length;

  return (
    <StoreSection title="Store Sliders">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Desktop Sliders" value={`${desktopCount}`} />
        <MetricCard label="Mobile Sliders" value={`${mobileCount}`} />
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        <Link
          className="text-sm font-bold text-brand-gold hover:text-brand-white"
          href="/store-slider-management"
        >
          Manage Live Sliders
        </Link>
        <Link
          className="text-sm font-bold text-brand-gold hover:text-brand-white"
          href="/store-slider-image-form"
        >
          Publish New Sliders
        </Link>
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ storeInfo: any, headerPreview: string, setHeaderPreview: (value: string) => void, setHeaderBase64: (value: string) => void, message: string, isSubmitting: boolean, onSubmit: () => Promise<boolean>, onDelete: () => Promise<boolean> }} props
 */
export function HeaderImageSection({
  storeInfo,
  headerPreview,
  setHeaderPreview,
  setHeaderBase64,
  message,
  isSubmitting,
  onSubmit,
  onDelete,
}) {
  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setHeaderPreview(result);
      setHeaderBase64(result.split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  }

  const currentImage = headerPreview || storeInfo?.headerImg || "";
  const isPremium = storeInfo?.prem;

  return (
    <StoreSection title="Website Header Image">
      <div className="overflow-hidden rounded-sm border border-white/10 bg-black/20">
        {currentImage ? (
          <div className="aspect-[5/1]">
            <img src={currentImage} alt="Website header" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[5/1] items-center justify-center text-sm text-white/35">
            No header image uploaded
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-white/15 px-5 text-sm font-bold text-brand-white hover:border-brand-gold hover:text-brand-gold">
          Select Header Image
          <input
            className="hidden"
            type="file"
            accept="image/*"
            disabled={!isPremium}
            onChange={handleFileChange}
          />
        </label>
        <div className="w-full max-w-xs">
          <AuthButton type="button" disabled={isSubmitting || !isPremium} onClick={onSubmit}>
            {isSubmitting ? "Updating..." : "Update Header"}
          </AuthButton>
        </div>
        {storeInfo?.headerImg ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-red-400/30 px-5 text-sm font-bold text-red-300 hover:border-red-300 hover:text-red-100"
            type="button"
            disabled={!isPremium}
            onClick={onDelete}
          >
            Remove Header
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        <AuthMessage>
          {message || (!isPremium ? "Please upgrade to add a Website Header Image." : "")}
        </AuthMessage>
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ isOwner: boolean, isSubmitting: boolean, onDeactivate: () => Promise<boolean> }} props
 */
export function AccountSettingsSection({ isOwner, isSubmitting, onDeactivate }) {
  return (
    <StoreSection title="Account Settings">
      <div className="space-y-4 text-sm">
        <SettingsLink href="/settings/profile" label="Profile Settings" />
        {isOwner ? (
          <SettingsLink
            href="/settings/bank"
            label="Bank Details"
            helper="Manage the payout account used for your store settlements."
          />
        ) : null}
        <SettingsLink href="/settings/change-password" label="Change Password" />
        <button
          className="flex w-full items-center justify-between rounded-sm border border-red-400/20 px-4 py-3 text-left text-red-300 hover:border-red-300/40 hover:text-red-100"
          type="button"
          disabled={isSubmitting}
          onClick={onDeactivate}
        >
          <span className="font-semibold">Deactivate Account</span>
          <span className="text-xs uppercase tracking-[0.14em]">Danger</span>
        </button>
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ storeInfo: any, isSubmitting: boolean, onCancel: () => Promise<boolean> }} props
 */
export function SubscriptionSection({ storeInfo, isSubmitting, onCancel }) {
  if (storeInfo?.plan === "F") {
    return (
      <StoreSection title="Store Subscription">
        <p className="text-sm text-white/60">This store is currently on the Free Plan.</p>
      </StoreSection>
    );
  }

  const planLabel =
    storeInfo?.plan === "S"
      ? "Silver Plan"
      : storeInfo?.plan === "G"
        ? "Gold Plan"
        : "Platinum Plan";

  return (
    <StoreSection title="Store Subscription">
      <div className="space-y-4">
        <InfoRow label="Active Plan" value={planLabel} />
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-red-400/25 px-5 text-sm font-bold text-red-300 hover:border-red-300 hover:text-red-100"
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancel Subscription
        </button>
      </div>
    </StoreSection>
  );
}

export function SupportSection() {
  const supportLinks = [
    ["Action Board", "/action-board/support-tickets", false],
    ["Tutorial Hub", "https://youtube.com/playlist?list=PLS7dZBv8UxNQov_iYFXjHcdgHdmaxXko9&si=QXZKwkAFmS0_Avo6", true],
    ["Terms & Conditions", "https://www.shopdibz.com/termsandconditions", true],
    ["Refund Policy", "https://www.shopdibz.com/returnspolicy", true],
    ["Help & Support", "https://www.shopdibz.com/contact", true],
    ["Contact Us", "/contact-us", false],
    ["Service Agreement", "https://www.shopdibz.com/seller-services-agreement", true],
  ];

  return (
    <StoreSection title="Shopdibz Brand Hub">
      <div className="space-y-3">
        {supportLinks.map(([label, href, external]) =>
          external ? (
            <a
              className="flex min-h-11 items-center justify-between rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 hover:border-brand-gold hover:text-brand-white"
              href={href}
              target="_blank"
              rel="noreferrer"
              key={label}
            >
              {label}
              <span className="text-brand-gold">Open</span>
            </a>
          ) : (
            <Link
              className="flex min-h-11 items-center justify-between rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 hover:border-brand-gold hover:text-brand-white"
              href={href}
              key={label}
            >
              {label}
              <span className="text-brand-gold">Open</span>
            </Link>
          ),
        )}
      </div>
    </StoreSection>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="text-right font-semibold text-brand-white">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-brand-white">{value}</p>
    </div>
  );
}

function SettingsLink({ href, label, helper }) {
  return (
    <Link
      className="block rounded-sm border border-white/10 px-4 py-3 hover:border-brand-gold/40"
      href={href}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-brand-white">{label}</span>
        <span className="text-xs uppercase tracking-[0.14em] text-brand-gold">Open</span>
      </div>
      {helper ? <p className="mt-2 text-xs text-white/40">{helper}</p> : null}
    </Link>
  );
}
