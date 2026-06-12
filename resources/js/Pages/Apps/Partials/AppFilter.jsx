import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { classNames } from "../../../Utils/helpers";

export default function AppFilter({ filter = {}, data = {} }) {
    const [search, setSearch] = useState(filter?.search || "");

    useEffect(() => {
        setSearch(filter?.search || "");
    }, [filter?.search]);

    const categories = Array.isArray(data?.categories) ? data.categories : [];
    const urusan = Array.isArray(data?.urusan) ? data.urusan : [];

    const visit = (params = {}) => {
        router.get(
            "/apps",
            {
                search: search || undefined,
                category_id: filter?.category_id || undefined,
                urusan_id: filter?.urusan_id || undefined,
                mode: filter?.mode || undefined,
                ...params,
                page: undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const submitSearch = (event) => {
        event.preventDefault();
        visit({ search: search || undefined });
    };

    const resetFilter = () => {
        setSearch("");
        router.get(
            "/apps",
            {},
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <aside className="h-fit rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100 lg:sticky lg:top-24">
            <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <SlidersHorizontal className="h-4 w-4" /> Filter Aplikasi
                </p>

                <button
                    type="button"
                    onClick={resetFilter}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                >
                    Reset
                </button>
            </div>

            <form onSubmit={submitSearch} className="mb-5">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari aplikasi..."
                        className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/50 py-3 pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </div>
            </form>

            <div className="space-y-6">
                <div>
                    <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <Filter className="h-3.5 w-3.5" /> Jenis Portal
                    </p>

                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => visit({ category_id: undefined })}
                            className={classNames(
                                "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition",
                                !filter?.category_id
                                    ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                            )}
                        >
                            <span>Semua Portal</span>
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                {data?.stats?.total ?? 0}
                            </span>
                        </button>

                        {categories.map((category) => {
                            const active = String(filter?.category_id || "") === String(category.id);

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => visit({ category_id: category.id })}
                                    className={classNames(
                                        "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition",
                                        active
                                            ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                    )}
                                >
                                    <span className="line-clamp-2 flex-1">{category.title}</span>
                                    <span className={classNames(
                                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-black",
                                        active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
                                    )}>
                                        {category.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        Mode Akses
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: "Semua", value: undefined },
                            { label: "SSO", value: "sso" },
                            { label: "Link", value: "link" },
                        ].map((item) => {
                            const active = String(filter?.mode || "") === String(item.value || "");

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => visit({ mode: item.value })}
                                    className={classNames(
                                        "rounded-2xl px-3 py-2 text-xs font-black transition",
                                        active
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                    )}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        Urusan / OPD
                    </p>

                    <select
                        value={filter?.urusan_id || ""}
                        onChange={(event) => visit({ urusan_id: event.target.value || undefined })}
                        className="h-12 w-full rounded-2xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-600 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    >
                        <option value="">Semua Urusan</option>
                        {urusan.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </aside>
    );
}
