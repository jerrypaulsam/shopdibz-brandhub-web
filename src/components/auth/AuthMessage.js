/**
 * @param {{ children?: import("react").ReactNode }} props
 */
export default function AuthMessage({ children }) {
  if (!children) {
    return null;
  }

  return <p className="text-center text-sm text-brand-gold">{children}</p>;
}
