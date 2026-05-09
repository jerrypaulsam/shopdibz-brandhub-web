import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchEditableStoreInfo, updateSizeChart, updateStoreInfo, updateStoreLogo, updateStoreTheme } from "@/src/api/store";
import { logScreenView } from "@/src/api/analytics";

export function useStoreInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    storeName: "",
    storeUrl: "",
    storeEmail: "",
    storeAddress: "",
    storeCity: "",
    storeState: "",
    storePinCode: "",
    storeDescription: "",
    contactNo: "",
    storeVideo: "",
    link1: "",
    link2: "",
    shipType: "SE",
    shipMode: "0",
    activateStore: true,
    enableReselling: false,
    themeId: "0",
  });
  const [storeInfo, setStoreInfo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [sizeChartPreview, setSizeChartPreview] = useState("");
  const [sizeChartBase64, setSizeChartBase64] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);

      try {
        const data = await fetchEditableStoreInfo();

        if (!isCurrent || !data) {
          return;
        }

        setStoreInfo(data);
        setForm((current) => ({
          ...current,
          storeName: data.name || "",
          storeUrl: data.url || "",
          storeEmail: data.storeEmail || data.email || "",
          storeAddress: data.address || data.adrs || "",
          storeCity: data.city || "",
          storeState: data.state || "",
          storePinCode: data.pCode || data.pinCode || "",
          storeDescription: data.description || data.desc || "",
          contactNo: (data.contactNo || "").replace("+91", ""),
          storeVideo: data.storeVideo || data.video || "",
          link1: data.link1 || "",
          link2: data.link2 || "",
          shipType: data.shipType || "SE",
          shipMode: data.shipMode || "0",
          activateStore: data.active ?? true,
          enableReselling: data.enableResell ?? false,
          themeId: String(data.storeTheme || "0"),
        }));
        setLogoPreview(data.logo || "");
        setMessage("");
        logScreenView("store_info_form", data.url || "Anonymous", "store");
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Could not load store info");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      isCurrent = false;
    };
  }, []);

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submitInfo() {
    if (!form.storeName || !form.storeEmail || !form.storeDescription || !form.contactNo) {
      setMessage("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateStoreInfo({
        name: form.storeName,
        storeUrl: form.storeUrl,
        storeEmail: form.storeEmail,
        link1: form.link1,
        link2: form.link2,
        contactNo: `+91${form.contactNo}`,
        description: form.storeDescription,
        address: form.storeAddress,
        city: form.storeCity,
        pinCode: form.storePinCode,
        state: form.storeState,
        active: form.activateStore,
        shipType: form.shipType,
        shipMode: form.shipMode,
        enableResell: form.enableReselling,
        storeVideo: normalizeYoutubeLink(form.storeVideo),
      });
      setMessage("Store Info Updated Successfully");
      await router.replace("/home");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Oops something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitLogo() {
    if (!logoBase64) {
      setMessage("Upload store logo first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStoreLogo(logoBase64);
      setMessage("Logo Updated Successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Logo update failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitSizeChart() {
    if (!sizeChartBase64) {
      setMessage("Upload size chart image first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSizeChart(sizeChartBase64);
      setMessage("Size Chart Updated Successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Size chart update failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitTheme() {
    setIsSubmitting(true);
    try {
      await updateStoreTheme(form.themeId);
      setMessage("Store Theme Updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Theme update failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    storeInfo,
    logoPreview,
    setLogoPreview,
    logoBase64,
    setLogoBase64,
    sizeChartPreview,
    setSizeChartPreview,
    sizeChartBase64,
    setSizeChartBase64,
    message,
    isLoading,
    isSubmitting,
    updateField,
    submitInfo,
    submitLogo,
    submitSizeChart,
    submitTheme,
  };
}

function normalizeYoutubeLink(value) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//.test(value)) {
    return value;
  }

  return `https://www.youtube.com/watch?v=${value}`;
}
