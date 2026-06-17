import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import IconPicker from "../../../../Components/Form/IconPicker";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";

export default function UrusanFormModal({ show, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        title: "",
        description: "",
        icon_name: "",
    });

    useEffect(() => {
        if (!show) return;

        form.setData({
            title: item?.title || "",
            description: item?.description || "",
            icon_name: item?.icon_name || "",
        });
        form.clearErrors();
    }, [show, item?.id]);

    if (!show) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({ title: "Perbarui Urusan?", text: "Perubahan urusan akan disimpan." })
            : await confirmSave({ title: "Simpan Urusan?", text: "Urusan baru akan ditambahkan." });

        if (!result.isConfirmed) return;

        const url = isEdit ? `/admin/references/urusan/${item.id}` : "/admin/references/urusan";
        const method = isEdit ? form.put : form.post;

        method(url, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit ? "Urusan berhasil diperbarui." : "Urusan berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({ title: "Gagal Menyimpan", text: "Periksa kembali form urusan." });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">Urusan / OPD</p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">{isEdit ? "Edit Urusan" : "Tambah Urusan"}</h3>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="max-h-[calc(92vh-8rem)] space-y-5 overflow-y-auto p-6">
                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Urusan</span>
                        <input
                            value={form.data.title}
                            onChange={(e) => form.setData("title", e.target.value)}
                            placeholder="Contoh: Dinas Komunikasi dan Informatika"
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                        />
                        {form.errors.title ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.title}</p> : null}
                    </label>

                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi</span>
                        <textarea
                            rows={4}
                            value={form.data.description || ""}
                            onChange={(e) => form.setData("description", e.target.value)}
                            placeholder="Deskripsi singkat urusan atau OPD..."
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-sky-300"
                        />
                    </label>

                    <IconPicker
                        label="Icon Urusan"
                        value={form.data.icon_name || ""}
                        onChange={(value) => form.setData("icon_name", value)}
                        error={form.errors.icon_name}
                        placeholder="Cari icon urusan..."
                    />

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
