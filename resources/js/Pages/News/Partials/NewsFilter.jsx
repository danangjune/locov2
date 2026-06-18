import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { RotateCcw, Search } from "lucide-react";
import SearchableSelect from "../../../Components/Form/SearchableSelect";

export default function NewsFilter({ filter = {}, data = {} }) {
    const [search, setSearch] = useState(filter?.search || "");
    const tags = Array.isArray(data?.tags) ? data.tags : [];

    useEffect(() => {
        setSearch(filter?.search || "");
    }, [filter?.search]);

    const visit = (params = {}) => {
        router.get(
            "/news",
            {
                search: search || undefined,
                tag: filter?.tag || undefined,
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
            "/news",
            {},
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <div className="mb-8 rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <form onSubmit={submitSearch} className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari berita..."
                        className="h-14 w-full rounded-2xl border border-sky-100 bg-sky-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </form>

                <select
                    value={filter?.tag || ""}
                    onChange={(event) => visit({ tag: event.target.value || undefined })}
                    className="h-14 rounded-2xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                >
                    <option value="">Semua Kategori</option>
                    {tags.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={resetFilter}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                >
                    <RotateCcw className="h-4 w-4" /> Reset
                </button>
            </div>
        </div>
    );
}
