import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ contactTypes: Array<{ id: string, desc: string }>, type: string, setType: (value: string) => void, contactMessage: string, setContactMessage: (value: string) => void, orderId: string, setOrderId: (value: string) => void, message: string, isSubmitting: boolean, onSubmit: () => Promise<boolean> }} props
 */
export default function ContactUsPanel({
  contactTypes,
  type,
  setType,
  contactMessage,
  setContactMessage,
  orderId,
  setOrderId,
  message,
  isSubmitting,
  onSubmit,
}) {
  return (
    <StoreSection title="Contact Us" subtitle="Open a support request that will appear inside your action board.">
      <div className="mx-auto max-w-[720px]">
        <label className="block">
          <span className="text-sm font-semibold text-white/80">Choose Contact Type</span>
          <select
            className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {contactTypes.map((item) => (
              <option className="bg-black" value={item.id} key={item.id}>
                {item.desc}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5">
          <StoreField
            label="Message"
            value={contactMessage}
            multiline
            onChange={setContactMessage}
          />
        </div>

        <div className="mt-5">
          <StoreField label="Order ID" value={orderId} onChange={setOrderId} />
        </div>

        <div className="mt-6">
          <AuthMessage>{message}</AuthMessage>
        </div>

        <div className="mt-6 max-w-xs">
          <AuthButton type="button" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </AuthButton>
        </div>
      </div>
    </StoreSection>
  );
}
