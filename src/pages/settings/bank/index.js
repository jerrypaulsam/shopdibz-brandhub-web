import DashboardShell from "@/src/components/dashboard/DashboardShell";
import BankDetailsFormPanel from "@/src/components/store/BankDetailsFormPanel";
import { useBankDetailsForm } from "@/src/hooks/store/useBankDetailsForm";

export default function BankDetailsPage() {
  const {
    form,
    savedBank,
    message,
    ifscDetails,
    isSubmitting,
    isLookingUpIfsc,
    isLoadingBank,
    isEditing,
    updateField,
    submitForm,
    startEditing,
    cancelEditing,
  } = useBankDetailsForm({ isFirstTime: false });

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <BankDetailsFormPanel
          form={form}
          savedBank={savedBank}
          message={message}
          ifscDetails={ifscDetails}
          isSubmitting={isSubmitting}
          isLookingUpIfsc={isLookingUpIfsc}
          isLoadingBank={isLoadingBank}
          isEditing={isEditing}
          onChange={updateField}
          onSubmit={submitForm}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          isFirstTime={false}
        />
      </div>
    </DashboardShell>
  );
}
