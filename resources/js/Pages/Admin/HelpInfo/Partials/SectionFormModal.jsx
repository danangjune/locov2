import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";

export default function SectionFormModal({ show, page, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        title: "",
        subtitle: "",
        content: "",
        image: null,
        sort_order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                title: item?.title || "",
                subtitle: item?.subtitle || "",
                content: item?.content || "",
                image: null,
                sort_order: item?.sort_order ?? 0,
                is_active: item?.is_active ?? true,
            });
        } else {
            form.setData({
                title: "",
                subtitle: "",
                content: "",
                image: null,
                sort_order: 0,
                is_active: true,
            });
        }

        form.clearErrors();
    }, [show, item?.id]);

    if (!show || !page?.id) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({
                  title: "Perbarui Section?",
                  text: "Perubahan section akan disimpan ke halaman public.",
              })
            : await confirmSave({
                  title: "Simpan Section?",
                  text: "Section baru akan ditambahkan ke halaman public.",
              });

        if (!result.isConfirmed) return;

        const url = isEdit
            ? `/admin/help-info/sections/${item.id}`
            : `/admin/help-info/${page.id}/sections`;

        if (isEdit) {
            form.transform((data) => ({
                ...data,
                _method: "PUT",
            }));
        } else {
            form.transform((data) => data);
        }

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit ? "Section berhasil diperbarui." : "Section berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({
                    title: isEdit ? "Gagal Memperbarui" : "Gagal Menyimpan",
                    text: "Periksa kembali data section yang belum sesuai.",
                });
            },
            onFinish: () => form.transform((data) => data),
        });
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Section" : "Tambah Section"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui Section Halaman" : "Tambah Section Halaman"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Halaman: <span className="font-black text-slate-700">{page.label || page.title}</span>
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="max-h-[calc(92vh-9rem)] overflow-y-auto p-6">
                    <div className="grid gap-5">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Judul <span className="text-rose-500">*</span></span>
                            <input
                                value={form.data.title}
                                onChange={(e) => form.setData("title", e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                            />
                            {form.errors.title ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.title}</p> : null}
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtitle</span>
                            <input
                                value={form.data.subtitle || ""}
                                onChange={(e) => form.setData("subtitle", e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Isi Section</span>
                            <textarea
                                rows={8}
                                value={form.data.content || ""}
                                onChange={(e) => form.setData("content", e.target.value)}
                                placeholder="Tulis narasi section. Pisahkan paragraf dengan enter."
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-sky-300"
                            />
                        </label>

                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Urutan</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.data.sort_order}
                                    onChange={(e) => form.setData("sort_order", e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                                />
                            </label>

                            <label className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={Boolean(form.data.is_active)}
                                    onChange={(e) => form.setData("is_active", e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="text-sm font-black text-slate-700">Section aktif</span>
                            </label>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-4">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Gambar Section</span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
                                    className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                />
                            </label>
                            {isEdit && item?.image ? (
                                <img src={item.image} alt={item.title} className="mt-4 h-36 w-full rounded-2xl object-cover" />
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
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
