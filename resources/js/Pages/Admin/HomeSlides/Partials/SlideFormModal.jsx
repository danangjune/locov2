import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Image as ImageIcon, Save, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";

export default function SlideFormModal({ show, item = null, onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        title: "",
        subtitle: "",
        body: "",
        url: "",
        button_label: "",
        secondary_label: "",
        secondary_url: "",
        image: null,
        sort_order: "",
        statusenabled: true,
        _method: "",
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                title: item?.title || "",
                subtitle: item?.subtitle || "",
                body: item?.body || "",
                url: item?.url || "",
                button_label: item?.button_label || "",
                secondary_label: item?.secondary_label || "",
                secondary_url: item?.secondary_url || "",
                image: null,
                sort_order: item?.sort_order ?? "",
                statusenabled: Boolean(item?.statusenabled),
                _method: "",
            });
        } else {
            form.setData({
                title: "",
                subtitle: "Portal satu pintu layanan digital Kota Kediri",
                body: "",
                url: "/apps",
                button_label: "Jelajahi Aplikasi",
                secondary_label: "Panduan Pengguna",
                secondary_url: "/guide",
                image: null,
                sort_order: "",
                statusenabled: true,
                _method: "",
            });
        }

        form.clearErrors();
    }, [show, item?.id]);

    if (!show) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({
                  title: "Perbarui Slide Beranda?",
                  text: "Perubahan slide beranda akan disimpan ke sistem.",
              })
            : await confirmSave({
                  title: "Simpan Slide Beranda?",
                  text: "Slide baru akan ditampilkan pada halaman beranda jika status aktif.",
              });

        if (!result.isConfirmed) return;

        const url = isEdit ? `/admin/home-slides/${item.id}` : "/admin/home-slides";

        form.transform((data) => {
            if (isEdit) {
                return {
                    ...data,
                    _method: "PUT",
                };
            }

            const { _method, ...payload } = data;
            return payload;
        });

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: isEdit ? "Berhasil Diperbarui" : "Berhasil Disimpan",
                    text: isEdit ? "Slide beranda berhasil diperbarui." : "Slide beranda berhasil ditambahkan.",
                });
                onClose();
            },
            onError: () => {
                alertError({
                    title: isEdit ? "Gagal Memperbarui" : "Gagal Menyimpan",
                    text: "Periksa kembali form yang masih belum sesuai.",
                });
            },
            onFinish: () => {
                form.transform((data) => data);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Slide" : "Tambah Slide"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui Slide Beranda" : "Tambah Slide Beranda"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Slide ini akan dipakai pada hero carousel halaman beranda PECUT.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="max-h-[calc(92vh-9rem)] overflow-y-auto p-6">
                    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
                        <div className="space-y-5">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Judul <span className="text-rose-500">*</span></span>
                                <input
                                    value={form.data.title}
                                    onChange={(e) => form.setData("title", e.target.value)}
                                    placeholder="Contoh: Semua Aplikasi Pemerintah Kota Kediri Dalam Satu Portal"
                                    className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.title ? "border-rose-300" : "border-slate-200"}`}
                                />
                                {form.errors.title && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.title}</p>}
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtitle / Badge</span>
                                <input
                                    value={form.data.subtitle}
                                    onChange={(e) => form.setData("subtitle", e.target.value)}
                                    placeholder="Portal satu pintu layanan digital Kota Kediri"
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi <span className="text-rose-500">*</span></span>
                                <textarea
                                    value={form.data.body}
                                    onChange={(e) => form.setData("body", e.target.value)}
                                    rows={5}
                                    placeholder="Tulis deskripsi singkat untuk hero beranda..."
                                    className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.body ? "border-rose-300" : "border-slate-200"}`}
                                />
                                {form.errors.body && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.body}</p>}
                            </label>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Teks Tombol Utama</span>
                                    <input
                                        value={form.data.button_label}
                                        onChange={(e) => form.setData("button_label", e.target.value)}
                                        placeholder="Jelajahi Aplikasi"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">URL Tombol Utama</span>
                                    <input
                                        value={form.data.url}
                                        onChange={(e) => form.setData("url", e.target.value)}
                                        placeholder="/apps atau https://..."
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Teks Tombol Kedua</span>
                                    <input
                                        value={form.data.secondary_label}
                                        onChange={(e) => form.setData("secondary_label", e.target.value)}
                                        placeholder="Panduan Pengguna"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">URL Tombol Kedua</span>
                                    <input
                                        value={form.data.secondary_url}
                                        onChange={(e) => form.setData("secondary_url", e.target.value)}
                                        placeholder="/guide atau https://..."
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Gambar Slide {isEdit ? "" : <span className="text-rose-500">*</span>}</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
                                        className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                    />
                                    {form.errors.image && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.image}</p>}
                                </label>

                                {isEdit && item?.image ? (
                                    <div className="mt-4 overflow-hidden rounded-2xl bg-white p-3">
                                        <img src={item.image} alt={item.title} className="h-40 w-full rounded-xl object-cover" />
                                        <p className="mt-2 text-xs font-semibold text-slate-500">Upload file baru hanya jika ingin mengganti gambar.</p>
                                    </div>
                                ) : !form.data.image ? (
                                    <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-400">
                                        <ImageIcon className="h-4 w-4" /> Rekomendasi rasio gambar 16:9.
                                    </div>
                                ) : null}
                            </div>

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

                            <label className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4">
                                <span>
                                    <span className="block text-sm font-black text-slate-800">Status Aktif</span>
                                    <span className="mt-1 block text-xs font-semibold text-slate-400">Matikan jika slide belum ingin ditampilkan.</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={Boolean(form.data.statusenabled)}
                                    onChange={(e) => form.setData("statusenabled", e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
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
