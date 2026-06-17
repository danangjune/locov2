import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { RotateCcw, Search, Filter, RefreshCw } from "lucide-react";

export default function ContentFooterFilter({ filter = {} }) {
    const [search, setSearch] = useState(filter?.search || "");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            "/admin/content-footer",
            { search: search || undefined, per_page: filter?.per_page || 10 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const reset = () => {
        setSearch("");
        router.get("/admin/content-footer", {}, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <label className="block">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Cari Content
                    </span>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-sky-300 focus-within:bg-white">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari content, URL, icon, atau gambar..."
                            className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </label>
                
                <div className="flex flex-wrap gap-2 h-full">
                    <div className="flex items-end gap-2 flex-wrap ">
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                        >
                            <RefreshCw className="h-4 w-4" /> Reset
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white hover:bg-sky-700"
                        >
                            <Filter className="h-4 w-4" /> Filter
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
