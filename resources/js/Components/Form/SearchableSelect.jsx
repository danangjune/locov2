import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

function defaultGetValue(option) {
    return option?.value ?? option?.id ?? "";
}

function defaultGetLabel(option) {
    return option?.label ?? option?.name ?? option?.title ?? "-";
}

export default function SearchableSelect({
    label = "Pilih Data",
    value = "",
    onChange,
    options = [],
    error = "",
    placeholder = "Pilih data",
    searchPlaceholder = "Cari data...",
    emptyText = "Data tidak ditemukan",
    required = false,
    disabled = false,
    maxHeightClass = "max-h-80",
    getOptionValue = defaultGetValue,
    getOptionLabel = defaultGetLabel,
    getSearchText,
    renderOption,
    renderSelected,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);

    const selectedOption = useMemo(() => {
        return options.find(
            (option) => String(getOptionValue(option)) === String(value || "")
        );
    }, [options, value, getOptionValue]);

    const filteredOptions = useMemo(() => {
        const keyword = String(query || "").toLowerCase().trim();

        if (!keyword) return options.slice(0, 120);

        return options
            .filter((option) => {
                const text = getSearchText
                    ? getSearchText(option)
                    : getOptionLabel(option);

                return String(text || "").toLowerCase().includes(keyword);
            })
            .slice(0, 120);
    }, [options, query, getOptionLabel, getSearchText]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const chooseOption = (option) => {
        onChange?.(getOptionValue(option), option);
        setQuery("");
        setOpen(false);
    };

    const clearValue = (event) => {
        event.stopPropagation();
        onChange?.("", null);
        setQuery("");
    };

    return (
        <div className="w-full" ref={wrapperRef}>
            {label ? (
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                    {label}
                    {required ? <span className="ml-1 text-rose-500">*</span> : null}
                </label>
            ) : null}

            <div className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setOpen((current) => !current)}
                    className={[
                        "flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm shadow-sm transition",
                        disabled ? "cursor-not-allowed opacity-60" : "",
                        error
                            ? "border-rose-300 ring-2 ring-rose-100"
                            : "border-slate-200 hover:border-sky-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                    ].join(" ")}
                >
                    <span className="min-w-0 flex-1">
                        {selectedOption ? (
                            renderSelected ? (
                                renderSelected(selectedOption)
                            ) : (
                                <span className="block truncate font-black text-slate-700">
                                    {getOptionLabel(selectedOption)}
                                </span>
                            )
                        ) : (
                            <span className="block truncate font-bold text-slate-400">
                                {placeholder}
                            </span>
                        )}
                    </span>

                    <span className="flex shrink-0 items-center gap-2">
                        {selectedOption && !disabled ? (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={clearValue}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        clearValue(event);
                                    }
                                }}
                                className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                                title="Hapus pilihan"
                            >
                                <X className="h-4 w-4" />
                            </span>
                        ) : null}

                        <ChevronDown
                            className={[
                                "h-5 w-5 text-slate-400 transition",
                                open ? "rotate-180" : "",
                            ].join(" ")}
                        />
                    </span>
                </button>

                {open && !disabled ? (
                    <div className="absolute z-[9999] mt-2 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200">
                        <div className="border-b border-slate-100 p-3">
                            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    autoFocus
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder={searchPlaceholder}
                                    className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className={`${maxHeightClass} overflow-y-auto p-2`}>
                            {filteredOptions.length ? (
                                filteredOptions.map((option) => {
                                    const optionValue = getOptionValue(option);
                                    const active =
                                        String(optionValue) ===
                                        String(value || "");

                                    return (
                                        <button
                                            key={optionValue}
                                            type="button"
                                            onClick={() => chooseOption(option)}
                                            className={[
                                                "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                                                active
                                                    ? "bg-sky-50 text-sky-700"
                                                    : "text-slate-700 hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            <span className="min-w-0 flex-1">
                                                {renderOption ? (
                                                    renderOption(option, active)
                                                ) : (
                                                    <span className="block truncate text-sm font-black">
                                                        {getOptionLabel(option)}
                                                    </span>
                                                )}
                                            </span>

                                            {active ? (
                                                <Check className="h-5 w-5 shrink-0 text-sky-600" />
                                            ) : null}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-sm font-black text-slate-700">
                                        {emptyText}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Coba gunakan kata kunci lain.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            {error ? (
                <p className="mt-2 text-xs font-bold text-rose-500">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
