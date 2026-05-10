import DashboardShell from "@/src/components/dashboard/DashboardShell";
import BankDetailsFormPanel from "@/src/components/store/BankDetailsFormPanel";
import { useBankDetailsForm } from "@/src/hooks/store/useBankDetailsForm";

export default function BankDetailsPage() {
  const {
    form,
    message,
    ifscDetails,
    isSubmitting,
    isLookingUpIfsc,
    updateField,
    submitForm,
  } = useBankDetailsForm({ isFirstTime: false });

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <BankDetailsFormPanel
          form={form}
          message={message}
          ifscDetails={ifscDetails}
          isSubmitting={isSubmitting}
          isLookingUpIfsc={isLookingUpIfsc}
          onChange={updateField}
          onSubmit={submitForm}
          isFirstTime={false}
        />
      </div>
    </DashboardShell>
  );
}
