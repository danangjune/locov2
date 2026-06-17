import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";

export default function AppFromFormModal({ show, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        name: "",
    });

    useEffect(() => {
        if (!show) return;

        form.setData({
            name: item?.name || "",
        });
        form.clearErrors();
    }, [show, item?.id]);

    if (!show) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({ title: "Perbarui Sumber Aplikasi?", text: "Perubahan sumber aplikasi akan disimpan." })
            : await confirmSave({ title: "Simpan Sumber Aplikasi?", text: "Sumber aplikasi baru akan ditambahkan." });

        if (!result.isConfirmed) return;

        const url = isEdit ? `/admin/references/app-from/${item.id}` : "/admin/references/app-from";
        const method = isEdit ? form.put : form.post;

        method(url, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit ? "Sumber aplikasi berhasil diperbarui." : "Sumber aplikasi berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({ title: "Gagal Menyimpan", text: "Periksa kembali form sumber aplikasi." });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">Sumber Aplikasi</p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">{isEdit ? "Edit Sumber Aplikasi" : "Tambah Sumber Aplikasi"}</h3>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-5 p-6">
                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Sumber</span>
                        <input
                            value={form.data.name}
                            onChange={(e) => form.setData("name", e.target.value)}
                            placeholder="Contoh: Internal Pemkot / Eksternal / Nasional"
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                        />
                        {form.errors.name ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.name}</p> : null}
                    </label>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
                            Batal
                        </button>
                        <button type="submit" disabled={form.processing} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:opacity-60">
                            <Save className="h-4 w-4" /> {form.processing ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
