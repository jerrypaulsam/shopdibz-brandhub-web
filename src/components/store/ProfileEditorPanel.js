/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import StoreField from "./StoreField";
import StoreSection from "./StoreSection";

/**
 * @param {{ storeInfo: any, fName: string, setFName: (value: string) => void, lName: string, setLName: (value: string) => void, email: string, setEmail: (value: string) => void, profilePreview: string, setProfilePreview: (value: string) => void, profileBase64: string, setProfileBase64: (value: string) => void, message: string, isLoading: boolean, isSubmitting: boolean, onSubmitDetails: () => Promise<boolean>, onSubmitPicture: () => Promise<boolean> }} props
 */
export default function ProfileEditorPanel({
  storeInfo,
  fName,
  setFName,
  lName,
  setLName,
  email,
  setEmail,
  profilePreview,
  setProfilePreview,
  profileBase64,
  setProfileBase64,
  message,
  isLoading,
  isSubmitting,
  onSubmitDetails,
  onSubmitPicture,
}) {
  const fileInputRef = useRef(null);
  const [cropFile, setCropFile] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }
    setCropFile(file);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <StoreSection title="Profile Picture" subtitle="Update the profile image used across seller hub surfaces.">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-[128px] w-[128px] overflow-hidden rounded-full border border-white/10 bg-white/5">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/35">
                No Image
              </div>
            )}
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <InfoPill label="Store" value={storeInfo?.name || "Store"} />
            <InfoPill label="Plan" value={storeInfo?.plan || "Free"} />
          </div>

          <button
            className="w-full rounded-sm border border-white/10 px-4 py-3 text-center text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Image
          </button>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {profileBase64 ? (
            <AuthButton
              type="button"
              disabled={isSubmitting || isLoading}
              onClick={onSubmitPicture}
            >
              {isSubmitting ? "Updating..." : "Update Image"}
            </AuthButton>
          ) : null}

          <p className="text-center text-xs leading-5 text-white/45">
            Use a square image for the cleanest account avatar across the seller workspace.
          </p>
        </div>
      </StoreSection>

      <StoreSection title="Profile" subtitle="Keep your seller account details accurate for brand operations and communication.">
        <div className="grid gap-5 md:grid-cols-2">
          <StoreField
            label="First Name"
            value={fName}
            maxLength={15}
            onChange={setFName}
          />
          <StoreField
            label="Last Name"
            value={lName}
            maxLength={15}
            onChange={setLName}
          />
          <div className="md:col-span-2">
            <StoreField
              label="Email"
              value={email}
              type="email"
              onChange={setEmail}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoPill label="Store URL" value={storeInfo?.url || "---"} />
          <InfoPill label="Email Status" value={email ? "Configured" : "Missing"} />
          <InfoPill label="Profile Status" value={fName && email ? "Ready" : "Needs Attention"} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="w-full max-w-xs">
            <AuthButton disabled={isSubmitting || isLoading} type="button" onClick={onSubmitDetails}>
              {isSubmitting ? "Saving..." : "Save Profile"}
            </AuthButton>
          </div>
          <Link
            className="text-sm font-bold text-brand-gold transition-colors hover:text-brand-white"
            href="/verify-email"
          >
            Verify Email
          </Link>
        </div>

        <div className="mt-6 rounded-sm border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/55">
          Keep your primary email current here, then use the verification route to confirm email changes.
        </div>

        <div className="mt-6">
          <AuthMessage>{message}</AuthMessage>
        </div>
        <AspectCropDialog
          open={Boolean(cropFile)}
          file={cropFile}
          title="Crop Profile Picture"
          aspectRatio={1}
          outputWidth={1080}
          shape="circle"
          onCancel={() => setCropFile(null)}
          onConfirm={({ dataUrl, base64 }) => {
            setProfilePreview(dataUrl);
            setProfileBase64(base64);
            setCropFile(null);
          }}
        />
      </StoreSection>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function InfoPill({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-brand-white">{value}</p>
    </div>
  );
}
