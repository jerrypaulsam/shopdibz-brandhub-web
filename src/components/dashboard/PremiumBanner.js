/**
 * @param {{ storeInfo: any, onHide: () => void }} props
 */
export default function PremiumBanner({ storeInfo, onHide }) {
  if (storeInfo?.prem) {
    return null;
  }

  return (
    <section className="rounded-[20px] bg-[#121212] px-5 py-4">
      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <p className="text-base font-bold text-brand-white">
            Upgrade to Unlock All Features.
          </p>
          <p className="mt-1 text-sm text-white/55">
            Be the first one to try all upcoming features.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="rounded-sm bg-[#2d5a42] px-4 py-2 text-sm font-bold text-brand-white"
            href={`https://loadapp.shopdibz.com/api/store/get/subscription_plans/?store_url=${storeInfo?.url || ""}`}
            target="_blank"
            rel="noreferrer"
          >
            Upgrade
          </a>
          <button
            className="rounded-sm px-4 py-2 text-sm font-bold text-white/70 hover:text-brand-white"
            type="button"
            onClick={onHide}
          >
            Hide
          </button>
        </div>
      </div>
    </section>
  );
}
