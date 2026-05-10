import DashboardShell from "@/src/components/dashboard/DashboardShell";
import CouponCreateWorkspace from "@/src/components/coupon/CouponCreateWorkspace";
import { useCreateCouponForm } from "@/src/hooks/coupon/useCreateCouponForm";

export default function CreateCouponPage() {
  const couponForm = useCreateCouponForm();

  return (
    <DashboardShell>
      <CouponCreateWorkspace {...couponForm} />
    </DashboardShell>
  );
}
