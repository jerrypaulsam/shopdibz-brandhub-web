import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NewProductIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products/new/category");
  }, [router]);

  return null;
}
