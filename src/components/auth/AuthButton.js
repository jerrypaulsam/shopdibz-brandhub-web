/**
 * @param {{ children: import("react").ReactNode, type?: "button" | "submit", disabled?: boolean, onClick?: () => void }} props
 */
export default function AuthButton({
  children,
  type = "submit",
  disabled = false,
  onClick,
}) {
  return (
    <button
      className="min-h-11 w-full rounded-sm bg-brand-gold px-5 py-3 text-sm font-bold text-brand-black transition-colors hover:bg-brand-white disabled:cursor-not-allowed disabled:opacity-60"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
