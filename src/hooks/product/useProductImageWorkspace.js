import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  addFurtherProductImages,
  addVariationImages,
  fetchProductDetail,
  makeExistingProductCoverImage,
  removeExistingProductImage,
  replaceExistingProductImage,
} from "@/src/api/products";
import { resolveActiveVariation } from "@/src/utils/product";

/**
 * @param {"product" | "variation"} mode
 * @returns {{
 * product: any,
 * activeVariation: any,
 * images: Array<{ id: number, filename: string, base64: string, previewUrl: string }>,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * onFilesSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>,
 * removeImage: (id: number) => void,
 * removeCurrentImage: (imageId: number) => Promise<void>,
 * replaceCurrentImage: (imageId: number, file: File) => Promise<void>,
 * makeCoverImage: (imageId: number) => Promise<void>,
 * submit: () => Promise<void>,
 * slug: string,
 * variationId: string,
 * maxImages: number,
 * }}
 */
export function useProductImageWorkspace(mode) {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : String(router.query.slug || "");
  const variationId = Array.isArray(router.query["variation-id"])
    ? router.query["variation-id"][0]
    : String(router.query["variation-id"] || "");

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const maxImages = mode === "variation" ? 3 : 6;

  useEffect(() => {
    async function load() {
      if (!slug) {
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchProductDetail(slug);
        setProduct(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Product could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [slug]);

  const activeVariation = resolveActiveVariation(product?.prdtVari || [], variationId);

  async function onFilesSelected(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    if (images.length + files.length > maxImages) {
      setError(`Only a maximum of ${maxImages} images can be uploaded.`);
      return;
    }

    const nextImages = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: Date.now() + Math.random(),
                filename: file.name,
                base64: String(reader.result || "").split(",")[1] || "",
                previewUrl: String(reader.result || ""),
              });
            reader.readAsDataURL(file);
          }),
      ),
    );

    setError("");
    setImages((currentImages) => [...currentImages, ...nextImages]);
  }

  function removeImage(id) {
    setImages((currentImages) => currentImages.filter((image) => image.id !== id));
  }

  async function removeCurrentImage(imageId) {
    try {
      setError("");
      await removeExistingProductImage({ imageId });
      const data = await fetchProductDetail(slug);
      setProduct(data);
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Image could not be removed.",
      );
    }
  }

  async function replaceCurrentImage(imageId, file) {
    try {
      setError("");
      const result = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.readAsDataURL(file);
      });

      await replaceExistingProductImage({
        imageId,
        imageBase64: String(result).split(",")[1] || "",
        filename: file.name,
        cover: false,
      });
      const data = await fetchProductDetail(slug);
      setProduct(data);
    } catch (replaceError) {
      setError(
        replaceError instanceof Error
          ? replaceError.message
          : "Image could not be replaced.",
      );
    }
  }

  async function makeCoverImage(imageId) {
    try {
      setError("");
      await makeExistingProductCoverImage({ imageId });
      const data = await fetchProductDetail(slug);
      setProduct(data);
    } catch (coverError) {
      setError(
        coverError instanceof Error
          ? coverError.message
          : "Cover image could not be updated.",
      );
    }
  }

  async function submit() {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      if (!images.length) {
        setError("Select at least one image.");
        return;
      }

      if (mode === "variation") {
        await addVariationImages({
          variationId: Number(variationId || 0),
          images: images.map((image) => ({
            base64: image.base64,
            filename: image.filename,
          })),
        });
      } else {
        await addFurtherProductImages({
          slug,
          images: images.map((image) => ({
            base64: image.base64,
            filename: image.filename,
          })),
        });
      }

      setSuccess("Images added successfully.");
      setImages([]);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Images could not be uploaded.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    product,
    activeVariation,
    images,
    isLoading,
    isSubmitting,
    error,
    success,
    onFilesSelected,
    removeImage,
    removeCurrentImage,
    replaceCurrentImage,
    makeCoverImage,
    submit,
    slug,
    variationId,
    maxImages,
  };
}
