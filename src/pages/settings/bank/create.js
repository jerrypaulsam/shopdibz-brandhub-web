import AuthShell from "@/src/components/auth/AuthShell";
import BankDetailsFormPanel from "@/src/components/store/BankDetailsFormPanel";
import { useBankDetailsForm } from "@/src/hooks/store/useBankDetailsForm";

export default function BankDetailsCreatePage() {
  const {
    form,
    savedBank,
    message,
    fieldErrors,
    ifscDetails,
    isSubmitting,
    isLookingUpIfsc,
    isLoadingBank,
    isEditing,
    updateField,
    submitForm,
    startEditing,
    cancelEditing,
  } = useBankDetailsForm({ isFirstTime: true });

  return (
    <AuthShell centeredBrand title="Banking Details">
      <BankDetailsFormPanel
        form={form}
        savedBank={savedBank}
        message={message}
        fieldErrors={fieldErrors}
        ifscDetails={ifscDetails}
        isSubmitting={isSubmitting}
        isLookingUpIfsc={isLookingUpIfsc}
        isLoadingBank={isLoadingBank}
        isEditing={isEditing}
        onChange={updateField}
        onSubmit={submitForm}
        onStartEditing={startEditing}
        onCancelEditing={cancelEditing}
        isFirstTime
      />
    </AuthShell>
  );
}
