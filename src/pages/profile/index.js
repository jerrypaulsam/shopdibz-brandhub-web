import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ProfileIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile/store-settings");
  }, [router]);

  return null;
}
