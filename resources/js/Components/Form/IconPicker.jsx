import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
    DynamicIcon,
    getIconComponent,
    getIconOptions,
} from "../../Utils/iconRegistry";

export default function IconPicker({
    label = "Icon",
    value = "",
    onChange,
    error = "",
    placeholder = "Cari icon Font Awesome...",
    name = "",
    required = false,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);

    const selectedIcon = getIconComponent(value);

    const options = useMemo(() => {
        return getIconOptions(query, 160);
    }, [query]);

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

    const chooseIcon = (option) => {
        onChange?.(option.value);
        setQuery("");
        setOpen(false);
    };

    const clearIcon = () => {
        onChange?.("");
        setQuery("");
    };

    return (
        <div className="w-full" ref={wrapperRef}>
            {label ? (
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                    {label}
                    {required ? (
                        <span className="ml-1 text-rose-500">*</span>
                    ) : null}
                </label>
            ) : null}

            {name ? <input type="hidden" name={name} value={value || ""} /> : null}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((current) => !current)}
                    className={[
                        "flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-2 text-left text-sm shadow-sm transition",
                        error
                            ? "border-rose-300 ring-2 ring-rose-100"
                            : "border-slate-200 hover:border-sky-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                    ].join(" ")}
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                            {selectedIcon ? (
                                <DynamicIcon
                                    name={value}
                                    className="h-5 w-5"
                                />
                            ) : (
                                <Search className="h-5 w-5 text-slate-400" />
                            )}
                        </span>

                        <span className="min-w-0">
                            <span className="block truncate font-black text-slate-700">
                                {value || "Pilih icon"}
                            </span>
                            <span className="block truncate text-xs font-semibold text-slate-400">
                                {value
                                    ? "Font Awesome"
                                    : "Belum ada icon dipilih"}
                            </span>
                        </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-2">
                        {value ? (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    clearIcon();
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.stopPropagation();
                                        clearIcon();
                                    }
                                }}
                                className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                                title="Hapus icon"
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

                {open ? (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200">
                        <div className="border-b border-slate-100 p-3">
                            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    autoFocus
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder={placeholder}
                                    className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto p-2">
                            {options.length ? (
                                options.map((option) => {
                                    const IconComponent = option.IconComponent;
                                    const active = option.value === value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => chooseIcon(option)}
                                            className={[
                                                "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                                                active
                                                    ? "bg-sky-50 text-sky-700"
                                                    : "text-slate-700 hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                                                    <IconComponent className="h-5 w-5" />
                                                </span>

                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-black">
                                                        {option.name}
                                                    </span>
                                                    <span className="block truncate text-xs font-semibold text-slate-400">
                                                        Font Awesome
                                                    </span>
                                                </span>
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
                                        Icon tidak ditemukan
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Coba kata kunci lain, misalnya home,
                                        user, phone, map, file.
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