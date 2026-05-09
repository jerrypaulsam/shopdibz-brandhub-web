/**
 * @param {{ children: import("react").ReactNode, widthClass?: string, className?: string }} props
 */
export default function AuthCard({
  children,
  widthClass = "w-full max-w-[500px]",
  className = "",
}) {
  return (
    <section
      className={`${widthClass} rounded-[15px] border border-white/10 bg-[#121212] p-8 shadow-2xl sm:p-10 ${className}`}
    >
      {children}
    </section>
  );
}
