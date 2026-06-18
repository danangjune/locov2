import { router } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { useState } from "react";
import SearchableSelect from "../../../Components/Form/SearchableSelect";

export default function ComplaintFilter({ filter = {} }) {
    const [search, setSearch] = useState(filter?.search || "");
    const [status, setStatus] = useState(filter?.status || "");

    const optionStatus = [
        { id: "", title: "Semua" },
        { id: "open", title: "Belum Selesai" },
        { id: "finished", title: "Selesai" },
        { id: "diproses", title: "Diproses" },
        { id: "diterima", title: "Diterima" },
    ];

    const submit = (event) => {
        event.preventDefault();

        router.get(
            "/complaints",
            {
                search: search || undefined,
                status: status || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const reset = () => {
        setSearch("");
        setStatus("");
        router.get("/complaints", {}, { preserveState: false, replace: true });
    };

    return (
        <form onSubmit={submit} className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Search className="h-4 w-4 text-sky-600" /> Filter Aduan
            </div>

            <div className="mt-5 space-y-4">
                <div>
                    <label className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Kata kunci
                    </label>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari tiket, lokasi, isi aduan..."
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                <div>
                    <SearchableSelect
                        label="Status"
                        value={status}
                        onChange={(value) =>
                            setStatus(value)
                        }
                        options={optionStatus || []}
                        placeholder="Pilih status"
                        searchPlaceholder="Cari status..."
                        emptyText="Status tidak ditemukan"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.title}
                        getSearchText={(item) => item.title}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
                >
                    Terapkan Filter
                </button>

                {(filter?.search || filter?.status) && (
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                    >
                        <X className="h-4 w-4" /> Reset Filter
                    </button>
                )}
            </div>
        </form>
    );
}
