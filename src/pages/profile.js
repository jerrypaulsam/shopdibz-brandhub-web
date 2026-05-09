import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ProfileEditorPanel from "@/src/components/store/ProfileEditorPanel";
import { useProfileEditor } from "@/src/hooks/store/useProfileEditor";

export default function ProfilePage() {
  const {
    storeInfo,
    fName,
    setFName,
    lName,
    setLName,
    email,
    setEmail,
    profilePreview,
    setProfilePreview,
    setProfileBase64,
    message,
    isLoading,
    isSubmitting,
    submitProfileDetails,
    submitProfilePicture,
  } = useProfileEditor();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <ProfileEditorPanel
          storeInfo={storeInfo}
          fName={fName}
          setFName={setFName}
          lName={lName}
          setLName={setLName}
          email={email}
          setEmail={setEmail}
          profilePreview={profilePreview}
          setProfilePreview={setProfilePreview}
          setProfileBase64={setProfileBase64}
          message={message}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onSubmitDetails={submitProfileDetails}
          onSubmitPicture={submitProfilePicture}
        />
      </div>
    </DashboardShell>
  );
}
