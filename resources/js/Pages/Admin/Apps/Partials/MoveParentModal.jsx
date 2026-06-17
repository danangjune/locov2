import React, { useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { GitBranch, X } from "lucide-react";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";

export default function MoveParentModal({ app, parentOptions = [], onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        parent: app?.parent || 0,
    });

    const options = useMemo(() => {
        return [
            { id: 0, name: "Root / Tidak punya parent", category: "", urusan: "" },
            ...(parentOptions || []),
        ];
    }, [parentOptions]);

    if (!app) return null;

    const submit = (event) => {
        event.preventDefault();
        put(`/admin/apps/${app.id}/change-parent`, {
            preserveScroll: true,
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <form onSubmit={submit} className="w-full max-w-xl overflow-visible rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-sky-700">
                            <GitBranch className="h-3.5 w-3.5" /> Pindah Parent
                        </div>
                        <h3 className="mt-3 text-2xl font-black text-slate-950">
                            {app.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Pilih parent baru. Sistem akan mencegah parent yang berpotensi membuat struktur melingkar.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <SearchableSelect
                        label="Parent Baru"
                        value={data.parent ?? 0}
                        onChange={(value) => setData("parent", Number(value || 0))}
                        options={options}
                        error={errors?.parent}
                        placeholder="Pilih parent baru"
                        searchPlaceholder="Cari parent aplikasi..."
                        emptyText="Parent tidak ditemukan"
                        clearable={false}
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => `${item.name}${item.urusan ? ` — ${item.urusan}` : ""}`}
                        getSearchText={(item) => [item.name, item.urusan, item.category].filter(Boolean).join(" ")}
                        isOptionDisabled={(item) => Number(item.id) === Number(app.id)}
                        renderSelected={(item) => (
                            <span className="block min-w-0">
                                <span className="block truncate font-black text-slate-800">{item.name}</span>
                                {item.urusan ? (
                                    <span className="block truncate text-xs font-semibold text-slate-400">{item.urusan}</span>
                                ) : null}
                            </span>
                        )}
                        renderOption={(item) => (
                            <span className="block min-w-0">
                                <span className="block truncate text-sm font-black">{item.name}</span>
                                {item.urusan ? (
                                    <span className="mt-0.5 block truncate text-xs font-semibold text-slate-400">{item.urusan}</span>
                                ) : null}
                            </span>
                        )}
                    />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 p-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Simpan Parent
                    </button>
                </div>
            </form>
        </div>
    );
}
