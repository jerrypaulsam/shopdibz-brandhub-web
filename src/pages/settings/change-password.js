import AuthShell from "@/src/components/auth/AuthShell";
import ChangePasswordCard from "@/src/components/auth/ChangePasswordCard";
import { useChangePasswordForm } from "@/src/hooks/auth/useChangePasswordForm";

export default function ChangePasswordPage() {
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    isSubmitting,
    submitForm,
  } = useChangePasswordForm();

  async function handleSubmit(event) {
    event.preventDefault();
    await submitForm();
  }

  return (
    <AuthShell title="Change Password">
      <div className="flex flex-1 items-center justify-center py-8">
        <ChangePasswordCard
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          message={message}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthShell>
  );
}
