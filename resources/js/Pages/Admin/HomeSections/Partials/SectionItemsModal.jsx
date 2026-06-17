import React, { useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { Plus, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave } from "../../../../Utils/swal";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";

export default function SectionItemsModal({ show, section = null, appOptions = [], onClose }) {
    const form = useForm({
        app_id: "",
        sort_order: "",
    });

    useEffect(() => {
        if (!show) return;

        form.setData({
            app_id: "",
            sort_order: "",
        });
        form.clearErrors();
    }, [show, section?.id]);

    const usedAppIds = useMemo(() => {
        const children = Array.isArray(section?.children) ? section.children : [];
        return children.map((item) => Number(item.app_id));
    }, [section]);

    const availableApps = useMemo(() => {
        return appOptions.filter((app) => !usedAppIds.includes(Number(app.id)));
    }, [appOptions, usedAppIds]);

    if (!show || !section) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = await confirmSave({
            title: "Tambahkan Aplikasi?",
            text: "Aplikasi terpilih akan ditampilkan pada section beranda.",
            confirmButtonText: "Ya, Tambahkan",
        });

        if (!result.isConfirmed) return;

        form.post(`/admin/home-sections/sections/${section.id}/items`, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Ditambahkan",
                    text: "Aplikasi berhasil ditambahkan ke section.",
                });
                onClose();
            },
            onError: () => {
                alertError({
                    title: "Gagal Menambahkan",
                    text: "Periksa kembali aplikasi yang dipilih.",
                });
            },
        });
    };

    const selectedApp = appOptions.find((app) => Number(app.id) === Number(form.data.app_id));

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-visible rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">Tambah Aplikasi</p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">{section.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Pilih aplikasi yang akan tampil pada section ini di halaman beranda.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="max-h-[calc(92vh-9rem)] overflow-y-auto p-6">
                    <div className="space-y-5">
                        <SearchableSelect
                            label="Aplikasi"
                            required
                            value={form.data.app_id}
                            onChange={(value) => form.setData("app_id", value)}
                            options={availableApps}
                            error={form.errors.app_id}
                            placeholder="Pilih aplikasi"
                            searchPlaceholder="Cari nama aplikasi, OPD, kategori..."
                            emptyText="Aplikasi tidak ditemukan"
                            getOptionValue={(app) => app.id}
                            getOptionLabel={(app) => app.alias || app.name}
                            getSearchText={(app) => [
                                app.name,
                                app.alias,
                                app.description,
                                app.urusan?.title,
                                app.category?.title,
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            renderSelected={(app) => (
                                <span className="block min-w-0">
                                    <span className="block truncate font-black text-slate-800">
                                        {app.alias || app.name}
                                    </span>
                                    <span className="block truncate text-xs font-semibold text-slate-400">
                                        {app.urusan?.title || app.category?.title || "Aplikasi"}
                                    </span>
                                </span>
                            )}
                            renderOption={(app) => (
                                <span className="block min-w-0">
                                    <span className="block truncate text-sm font-black">
                                        {app.alias || app.name}
                                    </span>
                                    <span className="mt-0.5 block truncate text-xs font-semibold text-slate-400">
                                        {[app.urusan?.title, app.category?.title]
                                            .filter(Boolean)
                                            .join(" · ") || "Aplikasi"}
                                    </span>
                                </span>
                            )}
                        />

                        {selectedApp ? (
                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-sm font-black text-slate-800">{selectedApp.alias || selectedApp.name}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{selectedApp.description || "Tidak ada deskripsi."}</p>
                            </div>
                        ) : null}

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Urutan</span>
                            <input
                                type="number"
                                min="0"
                                value={form.data.sort_order}
                                onChange={(e) => form.setData("sort_order", e.target.value)}
                                placeholder="0"
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Plus className="h-4 w-4" /> {form.processing ? "Menyimpan..." : "Tambah Aplikasi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
