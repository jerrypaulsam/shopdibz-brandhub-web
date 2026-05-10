import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ActionBoardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/action-board/support-tickets");
  }, [router]);

  return null;
}
