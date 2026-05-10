import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { createCoupon } from "@/src/api/coupons";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import { firstCouponQuery, resolveCouponType } from "@/src/utils/coupons";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function nextMonthString() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

/**
 * @param {string} value
 * @returns {string}
 */
function isoDateString(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function useCreateCouponForm() {
  const router = useRouter();
  const typeSlug = firstCouponQuery(router.query.type) || "cash";
  const activeType = useMemo(() => resolveCouponType(typeSlug), [typeSlug]);

  const [couponCode, setCouponCode] = useState("");
  const [couponQuantity, setCouponQuantity] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [maxDiscountPercentageAmount, setMaxDiscountPercentageAmount] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [fromDate, setFromDate] = useState(todayString());
  const [toDate, setToDate] = useState(nextMonthString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getDashboardSession();
    logScreenView("coupon_create", session.storeUrl || "Anonymous", "store");
  }, []);

  async function setType(nextType) {
    const resolved = resolveCouponType(nextType);
    await router.replace(
      {
        pathname: "/coupons/create",
        query: {
          type: resolved.slug,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  function reset() {
    setCouponCode("");
    setCouponQuantity("");
    setDiscountAmount("");
    setDiscountPercentage("");
    setMaxDiscountPercentageAmount("");
    setMinPurchaseAmount("");
    setFromDate(todayString());
    setToDate(nextMonthString());
  }

  function validate() {
    const normalizedCode = couponCode.trim().toUpperCase();
    const minAmount = Number(minPurchaseAmount || 0);
    const quantity = Number(couponQuantity || 0);

    if (normalizedCode.length < 4 || normalizedCode.length > 15) {
      return "Coupon code must be between 4 and 15 characters.";
    }

    if (!quantity) {
      return "Number of coupon is required.";
    }

    if (!minAmount) {
      return "Min purchase amount is required.";
    }

    if (!fromDate || !toDate) {
      return "Start date and end date are required.";
    }

    if (new Date(`${toDate}T00:00:00`).getTime() < new Date(`${fromDate}T00:00:00`).getTime()) {
      return "End date must be after start date.";
    }

    if (activeType.slug === "cash") {
      const cashDiscount = Number(discountAmount || 0);

      if (!cashDiscount) {
        return "Discount amount is required.";
      }

      if (cashDiscount >= minAmount) {
        return "Discount amount should be less than min. purchase amount";
      }
    }

    if (activeType.slug === "percentage") {
      const percentage = Number(discountPercentage || 0);
      const maxDiscount = Number(maxDiscountPercentageAmount || 0);

      if (!percentage) {
        return "Discount percentage is required.";
      }

      if (!maxDiscount) {
        return "Max discount amount is required.";
      }

      if (maxDiscount >= minAmount) {
        return "Max discount amount should be less than min. purchase amount";
      }
    }

    return "";
  }

  async function submit() {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      await createCoupon({
        couponCode: couponCode.trim().toUpperCase(),
        type: activeType.code,
        minAmount: minPurchaseAmount,
        discountAmount: activeType.slug === "cash" ? discountAmount : "",
        validFrom: isoDateString(fromDate),
        validTo: isoDateString(toDate),
        quantity: couponQuantity,
        percentage: activeType.slug === "percentage" ? discountPercentage : "",
        maxDiscountAmount:
          activeType.slug === "percentage" ? maxDiscountPercentageAmount : "",
      });

      setMessage("Coupon Created");
      reset();
      await router.push("/coupons-list?tab=active");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Coupon could not be created",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    activeType,
    couponCode,
    couponQuantity,
    discountAmount,
    discountPercentage,
    error,
    fromDate,
    isSubmitting,
    maxDiscountPercentageAmount,
    message,
    minPurchaseAmount,
    toDate,
    reset,
    setCouponCode,
    setCouponQuantity,
    setDiscountAmount,
    setDiscountPercentage,
    setFromDate,
    setMaxDiscountPercentageAmount,
    setMinPurchaseAmount,
    setToDate,
    setType,
    submit,
  };
}
