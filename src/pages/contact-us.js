import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ContactUsPanel from "@/src/components/profile/ContactUsPanel";
import { useContactUsForm } from "@/src/hooks/profile/useContactUsForm";

export default function ContactUsPage() {
  const {
    contactTypes,
    type,
    setType,
    contactMessage,
    setContactMessage,
    orderId,
    setOrderId,
    message,
    isSubmitting,
    submitForm,
  } = useContactUsForm();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-6">
        <ContactUsPanel
          contactTypes={contactTypes}
          type={type}
          setType={setType}
          contactMessage={contactMessage}
          setContactMessage={setContactMessage}
          orderId={orderId}
          setOrderId={setOrderId}
          message={message}
          isSubmitting={isSubmitting}
          onSubmit={submitForm}
        />
      </div>
    </DashboardShell>
  );
}
