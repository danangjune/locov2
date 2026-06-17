import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import {
    alertError,
    alertSuccess,
    confirmSave,
    confirmUpdate,
} from "../../../../Utils/swal";

export default function StatFormModal({ show, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        label: "",
        value: "",
        sort_order: "",
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                label: item?.label || "",
                value: item?.value || "",
                sort_order: item?.sort_order ?? "",
            });
        } else {
            form.setData({
                label: "",
                value: "",
                sort_order: "",
            });
        }

        form.clearErrors();
    }, [show, item?.id]);

    if (!show) return null;

    const submit = async (event) => {
        event.preventDefault();

        const result = isEdit
            ? await confirmUpdate({
                  title: "Perbarui Statistik?",
                  text: "Perubahan statistik akan disimpan.",
              })
            : await confirmSave({
                  title: "Simpan Statistik?",
                  text: "Statistik baru akan ditambahkan ke halaman publik.",
              });

        if (!result.isConfirmed) return;

        const url = isEdit
            ? `/admin/selayang-pandang/stats/${item.id}`
            : "/admin/selayang-pandang/stats";

        form.transform((data) => {
            if (isEdit) {
                return {
                    ...data,
                    _method: "PUT",
                };
            }

            return data;
        });

        form.post(url, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit ? "Statistik berhasil diperbarui." : "Statistik berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({
                    title: isEdit ? "Gagal Memperbarui" : "Gagal Menyimpan",
                    text: "Periksa kembali form statistik.",
                });
            },
            onFinish: () => form.transform((data) => data),
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Statistik" : "Tambah Statistik"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui Statistik" : "Tambah Statistik"}
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="grid gap-5 p-6">
                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Label <span className="text-rose-500">*</span>
                        </span>
                        <input
                            value={form.data.label}
                            onChange={(event) => form.setData("label", event.target.value)}
                            className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 ${form.errors.label ? "border-rose-300" : "border-slate-200"}`}
                            placeholder="Kecamatan"
                        />
                        {form.errors.label ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.label}</p> : null}
                    </label>

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Nilai <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.data.value}
                                onChange={(event) => form.setData("value", event.target.value)}
                                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 ${form.errors.value ? "border-rose-300" : "border-slate-200"}`}
                                placeholder="3"
                            />
                            {form.errors.value ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.value}</p> : null}
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Urutan</span>
                            <input
                                type="number"
                                min="0"
                                value={form.data.sort_order}
                                onChange={(event) => form.setData("sort_order", event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                                placeholder="1"
                            />
                        </label>
                    </div>

                    <div className="mt-2 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
                            Batal
                        </button>
                        <button type="submit" disabled={form.processing} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save className="h-4 w-4" /> {form.processing ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
