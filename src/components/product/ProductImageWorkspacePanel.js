import { useRef } from "react";

import StoreSection from "@/src/components/store/StoreSection";
import AuthButton from "@/src/components/auth/AuthButton";

/**
 * @param {{ title: string, currentImages: any[], selectedImages: any[], maxImages: number, onFilesSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>, removeImage: (id: number) => void, removeCurrentImage: (imageId: number) => Promise<void>, replaceCurrentImage: (imageId: number, file: File) => Promise<void>, makeCoverImage: (imageId: number) => Promise<void>, submit: () => Promise<void>, isSubmitting: boolean }} props
 */
export default function ProductImageWorkspacePanel({
  title,
  currentImages,
  selectedImages,
  maxImages,
  onFilesSelected,
  removeImage,
  removeCurrentImage,
  replaceCurrentImage,
  makeCoverImage,
  submit,
  isSubmitting,
}) {
  const addImagesInputRef = useRef(null);
  const replaceInputRefs = useRef({});

  return (
    <div className="space-y-6">
      <StoreSection
        title={title}
        subtitle={`You can upload up to ${maxImages} images in this workspace.`}
      >
        {currentImages.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {currentImages.map((image) => (
              <div className="rounded-sm border border-white/10 bg-black/20 p-3" key={image.id}>
                <div className="aspect-square overflow-hidden rounded-sm bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Current product media"
                    className="h-full w-full object-contain"
                    src={image.images || ""}
                  />
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  Existing
                </p>
                <div className="mt-3 grid gap-2">
                  <button
                    className="rounded-sm border border-white/10 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-brand-white"
                    type="button"
                    onClick={() => replaceInputRefs.current[image.id]?.click()}
                  >
                    Replace
                  </button>
                  <input
                    ref={(node) => {
                      replaceInputRefs.current[image.id] = node;
                    }}
                    className="hidden"
                    accept="image/*"
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) {
                        replaceCurrentImage(image.id, file);
                      }
                    }}
                  />
                  <button
                    className="rounded-sm border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-white"
                    type="button"
                    onClick={() => makeCoverImage(image.id)}
                  >
                    Make Cover
                  </button>
                  <button
                    className="rounded-sm border border-red-400/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-300"
                    type="button"
                    onClick={() => removeCurrentImage(image.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <button
          className="mt-6 flex min-h-44 w-full items-center justify-center rounded-sm border border-dashed border-white/15 bg-black/20 p-6 text-center"
          type="button"
          onClick={() => addImagesInputRef.current?.click()}
        >
          <span>
            <span className="block text-sm font-bold text-brand-white">Select images</span>
            <span className="mt-2 block text-sm text-white/55">JPG or PNG</span>
          </span>
        </button>
        <input
          ref={addImagesInputRef}
          className="hidden"
          multiple
          accept="image/*"
          type="file"
          onChange={(event) => {
            onFilesSelected(event);
            event.target.value = "";
          }}
        />

        {selectedImages.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {selectedImages.map((image) => (
              <div className="rounded-sm border border-white/10 bg-black/20 p-3" key={image.id}>
                <div className="aspect-square overflow-hidden rounded-sm bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={image.filename}
                    className="h-full w-full object-contain"
                    src={image.previewUrl}
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

      {selectedImages.length ? (
        <div className="max-w-xs">
          <AuthButton type="button" disabled={isSubmitting} onClick={submit}>
            {isSubmitting ? "Uploading..." : "Add Images"}
          </AuthButton>
        </div>
      ) : null}
    </div>
  );
}
