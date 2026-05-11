import { useEffect, useState } from "react";
import { fetchEditableStoreInfo } from "@/src/api/store";
import { getAuthSession, updateSellerAccount, updateSellerProfilePicture } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";
import { useToast } from "@/src/components/app/ToastProvider";

export function useProfileEditor() {
  const { showToast } = useToast();
  const [storeInfo, setStoreInfo] = useState(null);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [profileBase64, setProfileBase64] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const data = await fetchEditableStoreInfo();

        if (!isCurrent || !data) {
          return;
        }

        const authSession = getAuthSession();
        const user = data?.user || authSession?.user || {};

        setStoreInfo(data);
        setFName(user.fName || "");
        setLName(user.lName || "");
        setEmail(user.email || "");
        setProfilePreview(user.proPic || "");

        logScreenView("profile_screen", data?.url || "Anonymous", "store");
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Profile could not be loaded");
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

  async function submitProfileDetails() {
    if (!fName.trim() || !email.trim()) {
      setMessage("First name and email are required.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateSellerAccount({
        fName: fName.trim(),
        lName: lName.trim(),
        email: email.trim(),
      });
      setMessage("Profile updated successfully");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile update failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitProfilePicture() {
    if (!profileBase64) {
      setMessage("Select an image first.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateSellerProfilePicture(profileBase64);
      const nextData = await fetchEditableStoreInfo();
      const authSession = getAuthSession();
      const nextUser = nextData?.user || authSession?.user || {};
      setStoreInfo(nextData || storeInfo);
      setProfilePreview(nextUser.proPic || profilePreview);
      setProfileBase64("");
      setMessage("Profile Picture updated successfully");
      showToast({
        message: "Profile picture updated successfully",
        type: "success",
      });
      return true;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Profile picture update failed",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    storeInfo,
    fName,
    setFName,
    lName,
    setLName,
    email,
    setEmail,
    profilePreview,
    setProfilePreview,
    profileBase64,
    setProfileBase64,
    message,
    isLoading,
    isSubmitting,
    submitProfileDetails,
    submitProfilePicture,
  };
}
