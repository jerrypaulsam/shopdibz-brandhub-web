import { useEffect, useMemo, useRef, useState } from "react";

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * @param {{
 * label: string,
 * value: string,
 * options: Array<{ value: string, label: string }>,
 * placeholder: string,
 * onChange: (value: string) => void,
 * disabled?: boolean,
 * emptyMessage?: string,
 * }} props
 */
export default function ProductSearchableSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  emptyMessage = "No matches found.",
}) {
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedOption = options.find((option) => option.value === value) || null;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(searchValue);

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      normalizeSearchValue(option.label).includes(normalizedQuery),
    );
  }, [options, searchValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function handleToggle() {
    if (disabled) {
      return;
    }

    setIsOpen((current) => !current);
    setSearchValue("");
  }

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
    setSearchValue("");
  }

  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/80">{label}</span>
      <div className="relative mt-3" ref={containerRef}>
        <button
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-left text-base text-brand-white outline-none transition-colors hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={disabled}
          onClick={handleToggle}
        >
          <span className={selectedOption ? "text-brand-white" : "text-white/35"}>
            {selectedOption?.label || placeholder}
          </span>
          <span className="ml-4 text-sm text-white/45">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen ? (
          <div className="theme-popover absolute left-0 right-0 z-30 mt-2 rounded-[18px] border shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="border-b border-white/10 p-3">
              <input
                ref={searchInputRef}
                className="w-full rounded-[12px] border border-white/10 bg-black/20 px-3 py-2 text-sm text-brand-white outline-none placeholder:text-white/30"
                type="text"
                value={searchValue}
                placeholder={`Search ${label.toLowerCase()}`}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      className={`block w-full rounded-[12px] px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-brand-gold/15 text-brand-gold"
                          : "text-white/75 hover:bg-white/8 hover:text-brand-white"
                      }`}
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-2 text-sm text-white/45">{emptyMessage}</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}
