import { useEffect, useRef } from "react";

/**
 * @param {{ hasMore: boolean, isLoading: boolean, onLoadMore: () => void, label?: string }} props
 */
export default function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onLoadMore,
  label = "Loading more...",
}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    const node = triggerRef.current;

    if (!node || !hasMore || isLoading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore && !isLoading) {
    return null;
  }

  return (
    <div
      ref={triggerRef}
      className="rounded-sm border border-white/10 bg-[#121212] px-5 py-4 text-center text-sm text-white/45"
    >
      {isLoading ? label : "Scroll to load more"}
    </div>
  );
}
