import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";

export default function SectionFormModal({ show, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        title: "",
        description: "",
        sort_order: "",
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                title: item?.title || "",
                description: item?.description || "",
                sort_order: item?.sort_order ?? "",
            });
        } else {
            form.setData({
                title: "",
                description: "",
                sort_order: "",
            });
        }

        form.clearErrors();
    }, [show, item?.id]);

    if (!show) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({
                title: "Perbarui Section Beranda?",
                text: "Perubahan section akan disimpan ke sistem.",
            })
            : await confirmSave({
                title: "Simpan Section Beranda?",
                text: "Section baru akan ditambahkan ke halaman beranda.",
            });

        if (!result.isConfirmed) return;

        const url = isEdit
            ? `/admin/home-sections/sections/${item.id}`
            : "/admin/home-sections/sections";

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit
                        ? "Section beranda berhasil diperbarui."
                        : "Section beranda berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({
                    title: isEdit ? "Gagal Memperbarui" : "Gagal Menyimpan",
                    text: "Periksa kembali form yang masih belum sesuai.",
                });
            },
        };

        if (isEdit) {
            form.put(url, options);
            return;
        }

        form.post(url, options);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Section" : "Tambah Section"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui Section Beranda" : "Tambah Section Beranda"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Section ini akan muncul di halaman beranda sebagai kelompok aplikasi pilihan.
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

                <form onSubmit={submit} className="space-y-5 p-6">
                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Judul Section <span className="text-rose-500">*</span>
                        </span>
                        <input
                            value={form.data.title}
                            onChange={(e) => form.setData("title", e.target.value)}
                            placeholder="Contoh: Layanan Prioritas Kota Kediri"
                            className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.title ? "border-rose-300" : "border-slate-200"}`}
                        />
                        {form.errors.title && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.title}</p>}
                    </label>

                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi</span>
                        <textarea
                            value={form.data.description}
                            onChange={(e) => form.setData("description", e.target.value)}
                            rows={4}
                            placeholder="Deskripsi singkat section..."
                            className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.description ? "border-rose-300" : "border-slate-200"}`}
                        />
                        {form.errors.description && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.description}</p>}
                    </label>

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

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
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
                            <Save className="h-4 w-4" /> {form.processing ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
