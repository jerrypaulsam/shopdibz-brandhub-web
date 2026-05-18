import Link from "next/link";

/**
 * @param {{
 * code?: string,
 * title: string,
 * description: string,
 * primaryAction?: { href: string, label: string },
 * secondaryAction?: { href: string, label: string, external?: boolean },
 * }} props
 */
export default function ErrorStatePage({
  code = "",
  title,
  description,
  primaryAction = { href: "/", label: "Go to Brand Hub" },
  secondaryAction = null,
}) {
  return (
    <main className="theme-app flex min-h-screen items-center justify-center px-6 py-10">
      <section className="theme-surface w-full max-w-2xl rounded-sm border p-8 text-center shadow-2xl sm:p-10">
        {code ? (
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            {code}
          </p>
        ) : null}
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          {title}
        </h1>
        <p className="theme-text-muted mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            <Link
              className="theme-action-accent inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-bold transition-colors"
              href={primaryAction.href}
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            secondaryAction.external ? (
              <a
                className="theme-action-neutral inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-semibold transition-colors"
                href={secondaryAction.href}
                target="_blank"
                rel="noreferrer"
              >
                {secondaryAction.label}
              </a>
            ) : (
              <Link
                className="theme-action-neutral inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-semibold transition-colors"
                href={secondaryAction.href}
              >
                {secondaryAction.label}
              </Link>
            )
          ) : null}
        </div>
      </section>
    </main>
  );
}
