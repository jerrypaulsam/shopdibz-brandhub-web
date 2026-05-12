import { useState } from "react";
import { createSingleProduct } from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import { useProductListingDraft } from "./useProductListingDraft";

/**
 * @returns {ReturnType<typeof useProductListingDraft> & {
 * images: Array<{ id: number, filename: string, base64: string, previewUrl: string }>,
 * error: string,
 * success: string,
 * isSubmitting: boolean,
 * onFilesSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>,
 * removeImage: (id: number) => void,
 * submitProduct: () => Promise<void>,
 * }}
 */
export function useProductImageForm() {
  const draftApi = useProductListingDraft();
  const { showToast } = useToast();
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onFilesSelected(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    if (images.length + files.length > 6) {
      const nextMessage = "Only a maximum of six images can be uploaded for a product";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return;
    }

    const nextImages = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = String(reader.result || "");
              resolve({
                id: Date.now() + Math.random(),
                filename: file.name,
                base64: result.split(",")[1] || "",
                previewUrl: result,
              });
            };
            reader.readAsDataURL(file);
          }),
      ),
    );

    setError("");
    setImages((currentImages) => [...currentImages, ...nextImages]);
  }

  function removeImage(id) {
    setImages((currentImages) =>
      currentImages.filter((image) => image.id !== id),
    );
  }

  async function submitProduct() {
    setError("");
    setSuccess("");

    const errors = draftApi.validateInfoStep().filter(
      (value) => value !== "Add at least one variation.",
    );

    if (errors.length) {
      setError(errors[0]);
      showToast({ message: errors[0], type: "error" });
      return;
    }

    if (!images.length) {
      const nextMessage = "Select at least one product image.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      await createSingleProduct(
        draftApi.buildSingleProductPayload(
          images.map((image) => ({
            base64: image.base64,
            filename: image.filename,
          })),
        ),
      );
      setSuccess("Product created successfully.");
      showToast({ message: "Product created successfully.", type: "success" });
      draftApi.resetDraft();
      await draftApi.router.replace("/home");
    } catch (submitError) {
      const nextMessage =
        submitError instanceof Error
          ? submitError.message
          : "Product could not be created.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...draftApi,
    images,
    error,
    success,
    isSubmitting,
    onFilesSelected,
    removeImage,
    submitProduct,
  };
}
