import { useState } from "react";
import { verifyBulkProductSheet } from "@/src/api/products";
import { PRODUCT_BULK_TEMPLATE_URLS } from "@/src/data/product-variation-options";

/**
 * @returns {{
 * fileName: string,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * templateLinks: { create: string, sample: string },
 * onFileSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>,
 * submitBulkVerify: () => Promise<void>,
 * }}
 */
export function useProductBulkVerificationForm() {
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const templateLinks = {
    create: PRODUCT_BULK_TEMPLATE_URLS.create["without-variant"],
    sample: PRODUCT_BULK_TEMPLATE_URLS.sample["without-variant"],
  };

  async function onFileSelected(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextFileName = String(file.name || "");
    const lowerName = nextFileName.toLowerCase();
    const isAcceptedFile =
      lowerName.endsWith(".xls") ||
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xlsm");

    if (!isAcceptedFile) {
      setError("Upload an XLS, XLSX, or XLSM listing sheet.");
      setSuccess("");
      return;
    }

    const result = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(file);
    });

    setError("");
    setSuccess("");
    setFileName(nextFileName);
    setFileBase64(String(result).split(",")[1] || "");
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
        variants: false,
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
    fileName,
    isSubmitting,
    error,
    success,
    templateLinks,
    onFileSelected,
    submitBulkVerify,
  };
}
