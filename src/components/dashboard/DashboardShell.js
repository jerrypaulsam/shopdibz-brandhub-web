import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function DashboardShell({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-brand-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#121212] xl:block">
          <DashboardSidebar />
        </aside>

        {isMenuOpen ? (
          <div className="fixed inset-0 z-40 xl:hidden">
            <button
              className="absolute inset-0 bg-black/70"
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <aside className="relative h-full w-72 overflow-y-auto bg-[#121212]">
              <DashboardSidebar onNavigate={() => setIsMenuOpen(false)} />
            </aside>
          </div>
        ) : null}

        <section className="min-w-0 flex-1">
          <button
            className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 bg-[#121212] xl:hidden"
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="h-0.5 w-5 bg-brand-white" />
          </button>
          {children}
        </section>
      </div>
    </main>
  );
}
