import { useState } from "react";
import {
  createProductsInBulk,
  verifyBulkProductSheet,
} from "@/src/api/products";
import { PRODUCT_BULK_TEMPLATE_URLS } from "@/src/data/product-variation-options";
import { useProductListingDraft } from "./useProductListingDraft";

/**
 * @returns {ReturnType<typeof useProductListingDraft> & {
 * fileName: string,
 * fileBase64: string,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * onFileSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>,
 * submitBulkCreate: () => Promise<void>,
 * submitBulkVerify: () => Promise<void>,
 * templateLinks: { create: string, sample: string },
 * }}
 */
export function useProductBulkUploadForm() {
  const draftApi = useProductListingDraft();
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const templateLinks = {
    create:
      PRODUCT_BULK_TEMPLATE_URLS.create[draftApi.draft.variantMode] ||
      PRODUCT_BULK_TEMPLATE_URLS.create["without-variant"],
    sample:
      PRODUCT_BULK_TEMPLATE_URLS.sample[draftApi.draft.variantMode] ||
      PRODUCT_BULK_TEMPLATE_URLS.sample["without-variant"],
  };

  async function onFileSelected(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const result = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(file);
    });

    setError("");
    setSuccess("");
    setFileName(file.name);
    setFileBase64(String(result).split(",")[1] || "");
  }

  async function submitBulkCreate() {
    setError("");
    setSuccess("");

    if (!draftApi.selection.category || !draftApi.selection.subCategory) {
      setError("Choose a category and subcategory first.");
      return;
    }
    if (!fileBase64) {
      setError("Upload the bulk listing sheet first.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createProductsInBulk({
        categoryId: draftApi.selection.category.id,
        subCategoryId: draftApi.selection.subCategory.id,
        itemSubCategoryId: draftApi.selection.itemSubCategory?.id,
        variants: draftApi.draft.variantMode === "with-variant",
        fileBase64,
        fileName,
      });
      setSuccess(
        "The sheet has been uploaded successfully. You will be notified once the products are listed.",
      );
      setFileName("");
      setFileBase64("");
      draftApi.resetDraft();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Bulk listing could not be submitted.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitBulkVerify() {
    setError("");
    setSuccess("");

    if (!fileBase64) {
      setError("Upload the bulk verification sheet first.");
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyBulkProductSheet({
        variants: draftApi.draft.variantMode === "with-variant",
        fileBase64,
        fileName,
      });
      setSuccess(
        "The sheet has been uploaded successfully. You will receive the report via email.",
      );
      setFileName("");
      setFileBase64("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Bulk sheet verification could not be submitted.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...draftApi,
    fileName,
    fileBase64,
    isSubmitting,
    error,
    success,
    onFileSelected,
    submitBulkCreate,
    submitBulkVerify,
    templateLinks,
  };
}
