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
              <div className="theme-surface-soft rounded-sm border p-4" key={image.id}>
                <div className="aspect-square overflow-hidden rounded-sm bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Current product media"
                    className="h-full w-full object-contain"
                    src={image.images || ""}
                  />
                </div>
                <p className="theme-text-muted mt-3 text-sm font-semibold">
                  Existing
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    className="theme-action-neutral rounded-sm border px-3 py-2 text-center text-sm font-semibold transition-colors"
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
                    className="theme-action-neutral rounded-sm border px-3 py-2 text-sm font-semibold transition-colors"
                    type="button"
                    onClick={() => makeCoverImage(image.id)}
                  >
                    Make Cover
                  </button>
                  <button
                    className="theme-action-danger rounded-sm border px-3 py-2 text-sm font-semibold transition-colors"
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
          className="theme-surface mt-6 flex min-h-44 w-full items-center justify-center rounded-sm border border-dashed p-6 text-center"
          type="button"
          onClick={() => addImagesInputRef.current?.click()}
        >
          <span>
            <span className="block text-sm font-bold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
              Select images
            </span>
            <span className="theme-text-muted mt-2 block text-sm">JPG or PNG</span>
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
              <div className="theme-surface-soft rounded-sm border p-4" key={image.id}>
                <div className="aspect-square overflow-hidden rounded-sm bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={image.filename}
                    className="h-full w-full object-contain"
                    src={image.previewUrl}
                  />
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="theme-text-muted break-all text-sm">{image.filename}</p>
                  <button
                    className="theme-action-danger rounded-sm border px-3 py-2 text-sm font-semibold transition-colors"
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
