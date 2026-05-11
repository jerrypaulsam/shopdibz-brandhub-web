/**
 * @param {{
 * query: string,
 * setQuery: (value: string) => void,
 * suggestions: Array<{ id: string | number, title: string, slug: string, count: number }>,
 * isLoading: boolean,
 * message: string,
 * onSubmitSearch: (value?: string) => Promise<void>,
 * }} props
 */
export default function ProductSearchSuggestionsPanel({
  query,
  setQuery,
  suggestions,
  isLoading,
  message,
  onSubmitSearch,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
          Search Workspace
        </p>
        <h1 className="mt-3 text-3xl font-black text-brand-white">Search Titles</h1>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <label className="flex min-h-12 flex-1 items-center rounded-sm border border-white/10 bg-black/20 px-4">
            <input
              className="w-full bg-transparent text-sm text-brand-white outline-none placeholder:text-white/30"
              placeholder="Search Nike shoes, oversized tee, serum, bedsheet..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSubmitSearch();
                }
              }}
            />
          </label>
          <button
            className="min-h-12 rounded-sm border border-brand-gold bg-brand-gold px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-[#f5d279]"
            type="button"
            onClick={() => onSubmitSearch()}
          >
            Search
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-brand-white">Suggested Titles</h2>
            <p className="mt-2 text-sm text-white/45">
              Click a title to carry it straight into result search.
            </p>
          </div>
          {isLoading ? (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Loading
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {suggestions.length ? (
            suggestions.map((suggestion) => (
              <button
                className="rounded-sm border border-white/10 bg-black/20 p-4 text-left transition-colors hover:border-brand-gold hover:bg-black/30"
                type="button"
                key={suggestion.id}
                onClick={() => onSubmitSearch(suggestion.title)}
              >
                <p className="text-base font-bold text-brand-white">{suggestion.title}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  {suggestion.count ? `${suggestion.count} matches` : "Open search"}
                </p>
              </button>
            ))
          ) : (
            <div className="col-span-full rounded-sm border border-dashed border-white/15 bg-black/20 p-10 text-center">
              <p className="text-base font-bold text-brand-white">Type To Start</p>
              <p className="mt-2 text-sm text-white/45">
                Suggestions appear once you enter a search keyword.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
