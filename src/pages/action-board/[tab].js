import { useRouter } from "next/router";
import Link from "next/link";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ActionBoardPanel from "@/src/components/profile/ActionBoardPanel";
import { useActionBoard } from "@/src/hooks/profile/useActionBoard";

export default function ActionBoardTabPage() {
  const router = useRouter();
  const { tab } = router.query;
  const { tickets, isLoading, message } = useActionBoard();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <div className="mb-5 flex items-center gap-3">
          <TabLink active={tab === "support-tickets"} href="/action-board/support-tickets">
            Support Tickets
          </TabLink>
        </div>
        <ActionBoardPanel tickets={tickets} isLoading={isLoading} message={message} />
      </div>
    </DashboardShell>
  );
}

function TabLink({ active, href, children }) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center rounded-sm border px-4 text-sm font-bold ${
        active
          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
          : "border-white/10 text-white/65 hover:border-brand-gold hover:text-brand-white"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
