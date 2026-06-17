import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Filter, RefreshCw, Search } from "lucide-react";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";

const perPageOptions = [
    { id: 10, label: "10 root" },
    { id: 15, label: "15 root" },
    { id: 25, label: "25 root" },
    { id: 50, label: "50 root" },
];

export default function AppFilter({ filter = {}, options = {} }) {
    const [form, setForm] = useState({
        search: filter?.search || "",
        category_id: filter?.category_id || "",
        app_from_id: filter?.app_from_id || 1,
        is_active: Boolean(filter?.is_active),
        is_sso: Boolean(filter?.is_sso),
        show_all: filter?.show_all !== false,
        per_page: filter?.per_page || 15,
    });

    useEffect(() => {
        setForm({
            search: filter?.search || "",
            category_id: filter?.category_id || "",
            app_from_id: filter?.app_from_id || 1,
            is_active: Boolean(filter?.is_active),
            is_sso: Boolean(filter?.is_sso),
            show_all: filter?.show_all !== false,
            per_page: filter?.per_page || 15,
        });
    }, [filter]);

    const update = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const submit = (event) => {
        event.preventDefault();
        router.get("/admin/apps", form, {
            preserveState: true,
            replace: true,
        });
    };

    const reset = () => {
        router.get("/admin/apps", {}, {
            preserveState: false,
            replace: true,
        });
    };

    return (
        <form onSubmit={submit} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                <div className="flex-1">
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                        Cari aplikasi
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-50">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            value={form.search}
                            onChange={(event) => update("search", event.target.value)}
                            placeholder="Cari nama, alias, deskripsi, URL, urusan..."
                            className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:w-[520px]">
                    <SearchableSelect
                        label="Kategori"
                        value={form.category_id || ""}
                        onChange={(value) => update("category_id", value || "")}
                        options={options?.categories || []}
                        placeholder="Semua Kategori"
                        searchPlaceholder="Cari kategori..."
                        emptyText="Kategori tidak ditemukan"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.title}
                        getSearchText={(item) => item.title}
                    />

                    <SearchableSelect
                        label="Per Halaman"
                        value={form.per_page}
                        onChange={(value) => update("per_page", Number(value || 15))}
                        options={perPageOptions}
                        placeholder="Pilih jumlah"
                        searchPlaceholder="Cari jumlah..."
                        clearable={false}
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.label}
                    />
                </div>
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm">
                        <input
                            type="checkbox"
                            checked={form.show_all}
                            onChange={(event) => update("show_all", event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        Tampilkan Semua
                    </label>

                    <div className="w-full sm:w-64">
                        <SearchableSelect
                            label=""
                            value={form.app_from_id || 1}
                            onChange={(value) => update("app_from_id", Number(value || 1))}
                            options={options?.app_from || []}
                            placeholder="Pilih sumber aplikasi"
                            searchPlaceholder="Cari sumber aplikasi..."
                            emptyText="Sumber tidak ditemukan"
                            disabled={form.show_all}
                            clearable={false}
                            maxHeightClass="max-h-64"
                            getOptionValue={(item) => item.id}
                            getOptionLabel={(item) => item.name}
                        />
                    </div>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            disabled={form.show_all}
                            onChange={(event) => update("is_active", event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-40"
                        />
                        Aktif saja
                    </label>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm">
                        <input
                            type="checkbox"
                            checked={form.is_sso}
                            disabled={form.show_all}
                            onChange={(event) => update("is_sso", event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-40"
                        />
                        SSO saja
                    </label>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm hover:bg-slate-50"
                    >
                        <RefreshCw className="h-4 w-4" /> Reset
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Filter className="h-4 w-4" /> Terapkan
                    </button>
                </div>
            </div>
        </form>
    );
}
