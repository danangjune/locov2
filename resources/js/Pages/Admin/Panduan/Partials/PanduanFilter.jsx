import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { RotateCcw, Filter, RefreshCw, Search } from "lucide-react";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";

export default function PanduanFilter({ filter = {}, fileTypes = [] }) {
    const [search, setSearch] = useState(filter?.search || "");
    const [type, setType] = useState(filter?.type || "");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            "/admin/panduan",
            {
                search: search || undefined,
                type: type || undefined,
                per_page: filter?.per_page || 10,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const reset = () => {
        setSearch("");
        setType("");
        router.get("/admin/panduan", {}, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-start">
                <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                        Cari File
                    </span>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-sky-300 focus-within:bg-white">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama file, deskripsi, tipe, atau path..."
                            className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </label>

                <SearchableSelect
                    label="Tipe File"
                    value={type || ""}
                    onChange={(value) => setType(value || "")}
                    options={fileTypes}
                    placeholder="Semua Tipe"
                    searchPlaceholder="Cari tipe file..."
                    emptyText="Tipe file tidak ditemukan"
                    getOptionValue={(item) => item.id}
                    getOptionLabel={(item) => item.text}
                    getSearchText={(item) => `${item.id} ${item.text}`}
                />

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
