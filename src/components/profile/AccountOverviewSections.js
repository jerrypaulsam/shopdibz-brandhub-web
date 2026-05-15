/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import StoreSection from "@/src/components/store/StoreSection";
import { getStoreSliderMeta } from "@/src/utils/store-slider-routing";

/**
 * @param {{ storeInfo: any }} props
 */
export function StoreSettingsSection({ storeInfo }) {
  const description =
    storeInfo?.description ||
    storeInfo?.desc ||
    storeInfo?.storeDescription ||
    "---";

  return (
    <StoreSection title="Store Settings">
      <div className="space-y-4 text-sm">
        <InfoRow label="Store Name" value={storeInfo?.name || "---"} />
        <InfoRow label="Store URL" value={storeInfo?.url ? `@${storeInfo.url}` : "---"} />
        <InfoRow label="GSTIN" value={storeInfo?.tin || "---"} />
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/35">Description</p>
          <p className="mt-2 leading-6 text-white/75">{description}</p>
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
 * @param {{ storeInfo: any, bannerImages: any[] }} props
 */
export function StoreSlidersSection({ storeInfo, bannerImages }) {
  const sliderMeta = getStoreSliderMeta(storeInfo, bannerImages);

  return (
    <StoreSection title="Store Sliders">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Desktop Sliders" value={`${sliderMeta.desktopCount}`} />
        <MetricCard label="Mobile Sliders" value={`${sliderMeta.mobileCount}`} />
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        {sliderMeta.isPremium ? (
          <>
            <Link
              className="text-sm font-bold text-brand-gold hover:text-brand-white"
              href={sliderMeta.primaryActionHref}
            >
              {sliderMeta.primaryActionLabel}
            </Link>
          </>
        ) : null}
      </div>
      <div className="mt-4">
        <AuthMessage>
          {!sliderMeta.isPremium ? "Please upgrade to manage Website Sliders." : ""}
        </AuthMessage>
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ storeInfo: any, headerPreview: string, setHeaderPreview: (value: string) => void, headerBase64: string, setHeaderBase64: (value: string) => void, message: string, isSubmitting: boolean, onSubmit: () => Promise<boolean>, onDelete: () => Promise<boolean> }} props
 */
export function HeaderImageSection({
  storeInfo,
  headerPreview,
  setHeaderPreview,
  headerBase64,
  setHeaderBase64,
  message,
  isSubmitting,
  onSubmit,
  onDelete,
}) {
  const { confirm } = useConfirm();
  const fileInputRef = useRef(null);
  const [cropFile, setCropFile] = useState(null);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }
    setCropFile(file);
  }

  const currentImage = headerPreview || storeInfo?.headerImg || "";
  const isPremium = storeInfo?.prem;

  async function handleDelete() {
    const accepted = await confirm({
      title: "Remove Header Image",
      message: "The current website header image will be removed from your storefront.",
      confirmLabel: "Remove Header",
    });

    if (!accepted) {
      return;
    }

    await onDelete();
  }

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
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/15 px-5 text-sm font-bold text-brand-white hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={!isPremium}
          onClick={() => fileInputRef.current?.click()}
        >
          Select Header Image
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          disabled={!isPremium}
          onChange={handleFileChange}
        />
        {headerBase64 ? (
          <div className="w-full max-w-xs">
            <AuthButton type="button" disabled={isSubmitting || !isPremium} onClick={onSubmit}>
              {isSubmitting ? "Updating..." : "Update Header"}
            </AuthButton>
          </div>
        ) : null}
        {storeInfo?.headerImg ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-red-400/30 px-5 text-sm font-bold text-red-300 hover:border-red-300 hover:text-red-100"
            type="button"
            disabled={!isPremium}
            onClick={handleDelete}
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
      <AspectCropDialog
        open={Boolean(cropFile)}
        file={cropFile}
        title="Crop Header Image"
        aspectRatio={5 / 1}
        outputWidth={1500}
        outputHeight={300}
        onCancel={() => setCropFile(null)}
        onConfirm={({ dataUrl, base64 }) => {
          setHeaderPreview(dataUrl);
          setHeaderBase64(base64);
          setCropFile(null);
        }}
      />
    </StoreSection>
  );
}

/**
 * @param {{ isOwner: boolean, isSubmitting: boolean, onDeactivate: () => Promise<boolean> }} props
 */
export function AccountSettingsSection({ isOwner, isSubmitting, onDeactivate }) {
  const { confirm } = useConfirm();

  async function handleDeactivate() {
    const accepted = await confirm({
      title: "Deactivate Account",
      message: "This seller account will be deactivated and you will be signed out immediately.",
      confirmLabel: "Deactivate",
    });

    if (!accepted) {
      return;
    }

    await onDeactivate();
  }

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
          onClick={handleDeactivate}
        >
          <span className="font-semibold">Deactivate Account</span>
          <span className="text-xs uppercase tracking-[0.14em]">Danger</span>
        </button>
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ storeInfo: any, message: string, isSubmitting: boolean, onCancel: () => Promise<boolean> }} props
 */
export function SubscriptionSection({ storeInfo, message, isSubmitting, onCancel }) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const planCode = storeInfo?.plan || "F";
  const storeUrl = storeInfo?.url || "";
  const planLabel =
    planCode === "S"
      ? "Silver Plan"
      : planCode === "G"
        ? "Gold Plan"
        : planCode === "P"
          ? "Platinum Plan"
          : "Free Plan";
  const subscriptionUrl = storeUrl
    ? `https://loadapp.shopdibz.com/api/store/get/subscription_plans/?store_url=${storeUrl}`
    : "";

  return (
    <StoreSection title="Store Subscription">
      <div className="space-y-4">
        <AuthMessage>{message}</AuthMessage>
        <InfoRow label="Store Plan" value={planLabel} />
        {planCode === "F" ? (
          subscriptionUrl ? (
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-brand-gold/35 px-5 text-sm font-bold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
              href={subscriptionUrl}
              target="_blank"
              rel="noreferrer"
            >
              Upgrade Plan
            </a>
          ) : (
            <p className="text-sm text-white/60">This store is currently on the Free Plan.</p>
          )
        ) : (
          <div className="space-y-3">
            {!isConfirmingCancel ? (
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-red-400/25 px-5 text-sm font-bold text-red-300 hover:border-red-300 hover:text-red-100"
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsConfirmingCancel(true)}
              >
                Cancel Subscription
              </button>
            ) : (
              <div className="rounded-sm border border-red-400/20 bg-red-400/5 p-4">
                <p className="text-sm leading-6 text-red-100">
                  Are you sure? The current plan will be cancelled immediately and the store will switch back to the Free Plan.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-sm border border-red-400/35 px-4 text-sm font-bold text-red-300 hover:border-red-300 hover:text-red-100"
                    type="button"
                    disabled={isSubmitting}
                    onClick={async () => {
                      const success = await onCancel();
                      if (success) {
                        setIsConfirmingCancel(false);
                      }
                    }}
                  >
                    {isSubmitting ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-sm border border-white/10 px-4 text-sm font-bold text-white/70 hover:border-white/20 hover:text-brand-white"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsConfirmingCancel(false)}
                  >
                    Keep Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
