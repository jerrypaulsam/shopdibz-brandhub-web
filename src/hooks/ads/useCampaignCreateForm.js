import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { createAdCampaign } from "@/src/api/ads";
import { firstAdsQuery } from "@/src/utils/ads";

function nextDateString(days = 1) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function useCampaignCreateForm() {
  const router = useRouter();
  const mode = firstAdsQuery(router.query.mode) === "product" ? "product" : "store";
  const productName = firstAdsQuery(router.query["product-name"]);
  const productSlug = firstAdsQuery(router.query["product-slug"]);

  const [budgetType, setBudgetType] = useState("Total");
  const [budget, setBudget] = useState("");
  const [dailyBudget, setDailyBudget] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(nextDateString());
  const [biddingType, setBiddingType] = useState("CPC");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(
    () => (mode === "product" ? "Create product campaign" : "Create store campaign"),
    [mode],
  );

  async function submit() {
    try {
      setIsSubmitting(true);
      setMessage("");
      setError("");
      await createAdCampaign({
        budgetType,
        budget: budgetType === "Total" ? Number(budget || 0) : 0,
        dailyBudget: budgetType !== "Total" ? Number(dailyBudget || 0) : 0,
        startDate,
        endDate,
        productSlug: mode === "product" ? productSlug : "",
        campaignType: mode === "product" ? "Product" : "All",
        biddingType,
      });
      setMessage("Campaign created.");
      await router.push("/campaigns-list?tab=pending");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Campaign could not be created",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    mode,
    title,
    productName,
    productSlug,
    budgetType,
    budget,
    dailyBudget,
    startDate,
    endDate,
    biddingType,
    isSubmitting,
    message,
    error,
    setBudgetType,
    setBudget,
    setDailyBudget,
    setStartDate,
    setEndDate,
    setBiddingType,
    submit,
  };
}
