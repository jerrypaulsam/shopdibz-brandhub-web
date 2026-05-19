import StoreSection from "@/src/components/store/StoreSection";
import { DOWNLOAD_ITEMS } from "@/src/data/downloads";

export default function DownloadsWorkspace() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6">
      <div className="space-y-6">
        <StoreSection
          title="Downloads"
          subtitle="Download templates and sample sheets for bulk listing and product updates."
        >
          <div className="space-y-3">
            {DOWNLOAD_ITEMS.map((item) => (
              <article
                className="theme-panel-soft rounded-sm border p-4"
                key={item.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-brand-white">{item.label}</p>
                  </div>
                  <a
                    className="theme-action-accent inline-flex min-h-10 shrink-0 items-center justify-center rounded-sm border px-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download File
                  </a>
                </div>
              </article>
            ))}
          </div>
        </StoreSection>
      </div>
    </div>
  );
}
