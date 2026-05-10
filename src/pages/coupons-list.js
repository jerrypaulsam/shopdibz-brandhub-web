import DashboardShell from "@/src/components/dashboard/DashboardShell";
import CouponsWorkspace from "@/src/components/coupon/CouponsWorkspace";
import { useCouponList } from "@/src/hooks/coupon/useCouponList";

export default function CouponsListPage() {
  const couponState = useCouponList();

  return (
    <DashboardShell>
      <CouponsWorkspace {...couponState} />
    </DashboardShell>
  );
}
