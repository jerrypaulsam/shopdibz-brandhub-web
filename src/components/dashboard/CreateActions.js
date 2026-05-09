import Link from "next/link";

const actions = [
  ["Product", "/select-product-category", "+"],
  ["Store", "/store-info-form", "E"],
  ["Coupon", "/coupons/create", "+"],
  ["Campaign", "/campaigns/create", "+"],
];

export default function CreateActions() {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {actions.map(([label, href, icon]) => (
        <Link
          className="flex min-h-16 items-center justify-center gap-3 rounded-sm border border-white/10 bg-[#121212] px-4 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
          href={href}
          key={label}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-gold text-sm font-black text-brand-black">
            {icon}
          </span>
          {label}
        </Link>
      ))}
    </section>
  );
}
