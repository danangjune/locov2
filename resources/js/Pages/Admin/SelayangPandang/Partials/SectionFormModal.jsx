import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Image as ImageIcon, Save, X } from "lucide-react";
import {
    alertError,
    alertSuccess,
    confirmSave,
    confirmUpdate,
} from "../../../../Utils/swal";

export default function SectionFormModal({ show, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        title: "",
        subtitle: "",
        content: "",
        image: null,
        remove_image: false,
        sort_order: "",
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                title: item?.title || "",
                subtitle: item?.subtitle || "",
                content: item?.content || "",
                image: null,
                remove_image: false,
                sort_order: item?.sort_order ?? "",
            });
        } else {
            form.setData({
                title: "",
                subtitle: "",
                content: "",
                image: null,
                remove_image: false,
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
                  title: "Perbarui Bagian?",
                  text: "Perubahan bagian Selayang Pandang akan disimpan.",
              })
            : await confirmSave({
                  title: "Simpan Bagian?",
                  text: "Bagian baru akan ditambahkan ke halaman Selayang Pandang.",
              });

        if (!result.isConfirmed) return;

        const url = isEdit
            ? `/admin/selayang-pandang/sections/${item.id}`
            : "/admin/selayang-pandang/sections";

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
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit
                        ? "Bagian Selayang Pandang berhasil diperbarui."
                        : "Bagian Selayang Pandang berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({
                    title: isEdit ? "Gagal Memperbarui" : "Gagal Menyimpan",
                    text: "Periksa kembali form bagian Selayang Pandang.",
                });
            },
            onFinish: () => form.transform((data) => data),
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Bagian" : "Tambah Bagian"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui Bagian Selayang Pandang" : "Tambah Bagian Selayang Pandang"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Gunakan enter kosong untuk memisahkan paragraf pada konten.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="max-h-[calc(92vh-9rem)] overflow-y-auto p-6">
                    <div className="grid gap-5">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Judul Bagian <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.data.title}
                                onChange={(event) => form.setData("title", event.target.value)}
                                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 ${form.errors.title ? "border-rose-300" : "border-slate-200"}`}
                                placeholder="Profil Wilayah Kota Kediri"
                            />
                            {form.errors.title ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.title}</p> : null}
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtitle</span>
                            <input
                                value={form.data.subtitle}
                                onChange={(event) => form.setData("subtitle", event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                                placeholder="Letak, posisi geografis, dan pembagian wilayah administratif..."
                            />
                        </label>

                        <div className="grid gap-5 md:grid-cols-[1fr_160px]">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Gambar Bagian</span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(event) => form.setData("image", event.target.files?.[0] || null)}
                                    className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                />
                                {form.errors.image ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.image}</p> : null}
                                {isEdit && item?.image ? (
                                    <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(form.data.remove_image)}
                                            onChange={(event) => form.setData("remove_image", event.target.checked)}
                                            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                        />
                                        Hapus gambar saat ini
                                    </label>
                                ) : null}
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

                        {isEdit && item?.image ? (
                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                <img src={item.image} alt={item.title} className="h-16 w-24 rounded-xl object-cover" />
                                <div>
                                    <p className="text-sm font-black text-slate-800">Gambar saat ini</p>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">Upload gambar baru hanya jika ingin mengganti.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-400">
                                <ImageIcon className="h-4 w-4" /> Gambar bersifat opsional.
                            </div>
                        )}

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Konten</span>
                            <textarea
                                value={form.data.content}
                                onChange={(event) => form.setData("content", event.target.value)}
                                rows={9}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-sky-300"
                                placeholder={`Profil Wilayah — Kota Kediri merupakan...\n\nPosisi Geografis — Kota Kediri berada...`}
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
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
