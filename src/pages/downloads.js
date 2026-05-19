import Head from "next/head";
import Link from "next/link";
import BrandHubLogo from "@/src/components/app/BrandHubLogo";
import DownloadsWorkspace from "@/src/components/dashboard/DownloadsWorkspace";

export default function DownloadsPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="theme-app min-h-screen">
        <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-6">
          <div className="theme-panel-soft mb-6 flex items-center justify-between gap-4 rounded-sm border px-4 py-4">
            <Link className="flex min-w-0 items-center gap-3" href="/hub">
              <BrandHubLogo alt="Shopdibz seller logo" width={44} height={44} priority />
              <div className="min-w-0">
                <p className="text-sm font-extrabold tracking-wide text-brand-white">
                  Brand Hub
                </p>
                <p className="theme-text-muted text-xs">Downloads</p>
              </div>
            </Link>
            <Link
              className="theme-action-neutral inline-flex min-h-10 items-center justify-center rounded-sm border px-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
              href="/hub"
            >
              Open Brand Hub
            </Link>
          </div>
        </div>
      <DownloadsWorkspace />
      </main>
    </>
  );
}
