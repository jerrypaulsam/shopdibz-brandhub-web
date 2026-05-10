import AuthShell from "@/src/components/auth/AuthShell";
import BankDetailsFormPanel from "@/src/components/store/BankDetailsFormPanel";
import { useBankDetailsForm } from "@/src/hooks/store/useBankDetailsForm";

export default function BankDetailsCreatePage() {
  const {
    form,
    message,
    ifscDetails,
    isSubmitting,
    isLookingUpIfsc,
    updateField,
    submitForm,
  } = useBankDetailsForm({ isFirstTime: true });

  return (
    <AuthShell>
      <BankDetailsFormPanel
        form={form}
        message={message}
        ifscDetails={ifscDetails}
        isSubmitting={isSubmitting}
        isLookingUpIfsc={isLookingUpIfsc}
        onChange={updateField}
        onSubmit={submitForm}
        isFirstTime
      />
    </AuthShell>
  );
}
