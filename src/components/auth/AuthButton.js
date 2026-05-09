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
      className="h-[55px] w-full rounded-sm bg-brand-gold text-sm font-extrabold uppercase tracking-[0.18em] text-brand-black transition-colors hover:bg-brand-white disabled:cursor-not-allowed disabled:opacity-60"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
