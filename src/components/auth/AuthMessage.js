import ToastMessage from "@/src/components/app/ToastMessage";

/**
 * @param {{ children?: import("react").ReactNode }} props
 */
export default function AuthMessage({ children }) {
  if (!children) {
    return null;
  }

  return <ToastMessage message={typeof children === "string" ? children : ""} type="info" />;
}
