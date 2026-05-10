import { useEffect, useState } from "react";
import OnboardingPaywall from "@/src/components/dashboard/OnboardingPaywall";
import { fetchStoreInfo } from "@/src/api/dashboard";

export default function OnboardPaymentPage() {
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    fetchStoreInfo()
      .then((data) => {
        if (isCurrent) {
          setStoreInfo(data || {});
        }
      })
      .catch(() => {
        if (isCurrent) {
          setStoreInfo({});
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return <OnboardingPaywall storeInfo={storeInfo || {}} />;
}
