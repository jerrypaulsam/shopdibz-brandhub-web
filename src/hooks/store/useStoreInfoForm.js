import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  connectShopifyStore,
  connectWooCommerceStore,
  disconnectShopifyStore,
  disconnectWooCommerceStore,
  fetchEditableStoreInfo,
  syncShopifyStore,
  syncWooCommerceStore,
  updateSizeChart,
  updateStoreInfo,
  updateStoreLogo,
  updateStoreTheme,
} from "@/src/api/store";
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
  const [connectorForm, setConnectorForm] = useState({
    shopifyUrl: "",
    shopifyAccess: "",
    wooCommerceUrl: "",
    wooCommerceKey: "",
    wooCommerceSecret: "",
  });
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

  function updateConnectorField(key, value) {
    setConnectorForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function refreshStoreInfo() {
    const data = await fetchEditableStoreInfo();

    if (data) {
      setStoreInfo(data);
    }

    return data;
  }

  async function submitInfo() {
    const isInitialSetup = !storeInfo;
    const missingCoreFields =
      !form.storeName || !form.storeEmail || !form.storeDescription || !form.contactNo;
    const missingSetupFields =
      isInitialSetup &&
      (!form.storeUrl ||
        !form.storeAddress ||
        !form.storeCity ||
        !form.storeState ||
        !form.storePinCode);

    if (missingCoreFields || missingSetupFields) {
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

  async function submitShopifyConnection() {
    if (!connectorForm.shopifyUrl || !connectorForm.shopifyAccess) {
      setMessage("Please add both Shopify URL and access token.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await connectShopifyStore({
        url: connectorForm.shopifyUrl,
        access: connectorForm.shopifyAccess,
      });
      setConnectorForm((current) => ({
        ...current,
        shopifyUrl: "",
        shopifyAccess: "",
      }));
      await refreshStoreInfo();
      setMessage("Shopify Url Added. Please follow the tutorial to complete the setup");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Shopify connection failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitShopifySync() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await syncShopifyStore();
      await refreshStoreInfo();
      setMessage("Product inventory and prices will now be synced with your Shopify store in a few minutes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Shopify sync failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitShopifyDisconnect() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await disconnectShopifyStore();
      await refreshStoreInfo();
      setMessage("Successfully Disconnected");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Shopify disconnect failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitWooCommerceConnection() {
    if (!connectorForm.wooCommerceUrl || !connectorForm.wooCommerceKey || !connectorForm.wooCommerceSecret) {
      setMessage("Please add the WooCommerce URL, key, and secret.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await connectWooCommerceStore({
        url: connectorForm.wooCommerceUrl,
        key: connectorForm.wooCommerceKey,
        secret: connectorForm.wooCommerceSecret,
      });
      setConnectorForm((current) => ({
        ...current,
        wooCommerceUrl: "",
        wooCommerceKey: "",
        wooCommerceSecret: "",
      }));
      await refreshStoreInfo();
      setMessage("WooCommerce Information Added. Now you can start syncing your products");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "WooCommerce connection failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitWooCommerceSync() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await syncWooCommerceStore();
      await refreshStoreInfo();
      setMessage("Product inventory and prices will now be synced with your WooCommerce store.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "WooCommerce sync failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitWooCommerceDisconnect() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await disconnectWooCommerceStore();
      await refreshStoreInfo();
      setMessage("Successfully Disconnected");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "WooCommerce disconnect failed");
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
    connectorForm,
    message,
    isLoading,
    isSubmitting,
    updateField,
    updateConnectorField,
    submitInfo,
    submitLogo,
    submitSizeChart,
    submitTheme,
    submitShopifyConnection,
    submitShopifySync,
    submitShopifyDisconnect,
    submitWooCommerceConnection,
    submitWooCommerceSync,
    submitWooCommerceDisconnect,
  };
}

function normalizeYoutubeLink(value) {
  if (!value) {
    return null;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return `https://www.youtube.com/watch?v=${value}`;
  }

  if (/^https?:\/\//.test(value)) {
    const match = value.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    );

    if (match?.[1]) {
      return `https://www.youtube.com/watch?v=${match[1]}`;
    }
  }

  return null;
}
