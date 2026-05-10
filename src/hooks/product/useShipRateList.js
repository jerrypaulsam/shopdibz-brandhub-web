import { useState } from "react";
import { calculateShippingRates } from "@/src/api/products";

/**
 * @returns {{
 * form: any,
 * result: any,
 * isSubmitting: boolean,
 * error: string,
 * setFormField: (field: string, value: string) => void,
 * submit: () => Promise<void>,
 * }}
 */
export function useShipRateList() {
  const [form, setForm] = useState({
    pickupPin: "",
    deliveryPin: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    shippingMode: "air",
  });
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function setFormField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function submit() {
    try {
      setError("");
      setIsSubmitting(true);
      const data = await calculateShippingRates(form);
      setResult(Array.isArray(data) ? data[0] : data?.[0] || data);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Shipping rates could not be calculated.",
      );
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    result,
    isSubmitting,
    error,
    setFormField,
    submit,
  };
}
