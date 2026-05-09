import Link from "next/link";
import AuthButton from "./AuthButton";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import AuthMessage from "./AuthMessage";
import AuthTitle from "./AuthTitle";

/**
 * @param {{ oldPassword: string, setOldPassword: (value: string) => void, newPassword: string, setNewPassword: (value: string) => void, confirmPassword: string, setConfirmPassword: (value: string) => void, message: string, isSubmitting: boolean, onSubmit: (event: import('react').FormEvent<HTMLFormElement>) => Promise<void> }} props
 */
export default function ChangePasswordCard({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  message,
  isSubmitting,
  onSubmit,
}) {
  return (
    <AuthCard widthClass="w-full max-w-[720px]">
      <form onSubmit={onSubmit}>
        <AuthTitle
          title="Change Password"
          subtitle="Update your seller hub password securely."
        />

        <div className="mt-8 space-y-5">
          <AuthField
            label="Old Password"
            value={oldPassword}
            type="password"
            autoComplete="current-password"
            onChange={setOldPassword}
          />
          <AuthField
            label="New Password"
            value={newPassword}
            type="password"
            autoComplete="new-password"
            onChange={setNewPassword}
          />
          <AuthField
            label="Confirm New Password"
            value={confirmPassword}
            type="password"
            autoComplete="new-password"
            onChange={setConfirmPassword}
          />
        </div>

        <div className="mt-8">
          <AuthMessage>{message}</AuthMessage>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-[260px]">
            <AuthButton disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </AuthButton>
          </div>
          <Link
            className="text-sm font-bold text-brand-gold transition-colors hover:text-brand-white"
            href="/home"
          >
            Back to Dashboard
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
