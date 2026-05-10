import Image from "next/image";

const playlistUrl =
  "https://youtube.com/playlist?list=PLS7dZBv8UxNTLLAJwY4yoiHtgQDl8b4nl";

/**
 * @param {string} url
 * @returns {string | null}
 */
function getVideoId(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * @param {{ videoUrls: string[] }} props
 */
export default function D2CBrandStories({ videoUrls }) {
  /** @type {string[]} */
  const videoIds = videoUrls.map(getVideoId).filter(Boolean).slice(0, 5);

  return (
    <section className="bg-brand-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <a
          className="flex items-center justify-between gap-6 text-brand-black"
          href={playlistUrl}
          target="_blank"
          rel="noreferrer"
        >
          <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900 sm:text-xl">
            SHOPCAST: Indian D2C Stories
          </h2>
          <span className="text-2xl text-slate-800" aria-hidden="true">
            &gt;
          </span>
        </a>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
          {videoIds.map((videoId) => (
            <a
              className="group relative h-[210px] w-[320px] shrink-0 overflow-hidden rounded-sm bg-slate-200"
              href={`https://www.youtube.com/watch?v=${videoId}`}
              key={videoId}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Shopcast video"
            >
              <Image
                className="object-cover transition-transform group-hover:scale-105"
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="Shopcast video thumbnail"
                fill
                sizes="320px"
              />
              <span className="absolute inset-0 bg-black/25" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-white/95 pl-1 text-2xl font-black text-brand-black">
                  &gt;
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
