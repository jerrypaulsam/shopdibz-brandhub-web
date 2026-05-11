import Image from "next/image";
import { useRef } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ images: Array<{ id: number, filename: string, previewUrl: string }>, onFilesSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>, removeImage: (id: number) => void, submitProduct: () => Promise<void>, isSubmitting: boolean }} props
 */
export default function ProductImagePanel({
  images,
  onFilesSelected,
  removeImage,
  submitProduct,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-6">
      <StoreSection
        title="Product Images"
        subtitle="Upload up to six product images. The final create request is sent from this step so the media and payload arrive together."
      >
        <button
          className="flex min-h-52 w-full items-center justify-center rounded-sm border border-dashed border-white/15 bg-black/20 p-6 text-center"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <span>
            <span className="block text-sm font-bold text-brand-white">
              Select product images
            </span>
            <span className="mt-2 block text-sm text-white/55">
              JPG or PNG, up to 6 files
            </span>
          </span>
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          type="file"
          onChange={(event) => {
            onFilesSelected(event);
            event.target.value = "";
          }}
        />

        {images.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <div className="rounded-sm border border-white/10 bg-black/20 p-3" key={image.id}>
                <div className="relative aspect-square overflow-hidden rounded-sm bg-white">
                  <Image
                    src={image.previewUrl}
                    alt={image.filename}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="truncate text-sm text-white/65">{image.filename}</p>
                  <button
                    className="rounded-sm border border-red-400/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-300"
                    type="button"
                    onClick={() => removeImage(image.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submitProduct}>
          {isSubmitting ? "Submitting..." : "Add Product"}
        </AuthButton>
      </div>
    </div>
  );
}
