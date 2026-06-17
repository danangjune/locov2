import React, { useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { Image as ImageIcon, Save, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";
import IconPicker from "../../../../Components/Form/IconPicker";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";

export default function ContentFooterFormModal({ show, item = null, defaultParent = 0, parentOptions = [], onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        content: "",
        url: "",
        icon: "",
        image: null,
        parent: defaultParent || 0,
        idx_content: "",
        _method: "post",
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                content: item?.content || "",
                url: item?.url || "",
                icon: item?.icon || "",
                image: null,
                parent: item?.parent || 0,
                idx_content: item?.idx_content ?? "",
                _method: "put",
            });
        } else {
            form.setData({
                content: "",
                url: "",
                icon: "",
                image: null,
                parent: defaultParent || 0,
                idx_content: "",
                _method: "post",
            });
        }

        form.clearErrors();
    }, [show, item?.id, defaultParent]);

    const selectedParentLabel = useMemo(() => {
        if (Number(form.data.parent || 0) === 0) return "Root / Group Footer";
        return parentOptions.find((option) => Number(option.id) === Number(form.data.parent))?.content || "Parent dipilih";
    }, [form.data.parent, parentOptions]);

    const parentSelectOptions = useMemo(() => {
        return [
            { id: 0, content: "Root / Group Footer" },
            ...(parentOptions || []),
        ];
    }, [parentOptions]);

    if (!show) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({
                title: "Perbarui Content Footer?",
                text: "Perubahan content footer akan disimpan ke sistem.",
            })
            : await confirmSave({
                title: "Simpan Content Footer?",
                text: "Content footer baru akan ditambahkan ke sistem.",
            });

        if (!result.isConfirmed) return;

        const url = isEdit
            ? `/admin/content-footer/${item.id}`
            : "/admin/content-footer";

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
                    text: isEdit
                        ? "Content footer berhasil diperbarui."
                        : "Content footer berhasil ditambahkan.",
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
            <div className="max-h-[92vh] w-full max-w-2xl overflow-visible rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Content" : "Tambah Content"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui Content Footer" : "Tambah Content Footer"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Parent saat ini: <span className="font-black text-slate-700">{selectedParentLabel}</span>
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
                    <div className="grid gap-5">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Content <span className="text-rose-500">*</span>
                            </span>
                            <textarea
                                value={form.data.content}
                                onChange={(e) => form.setData("content", e.target.value)}
                                rows={4}
                                placeholder="Input judul atau isi content footer..."
                                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.content ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {form.errors.content && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.content}</p>}
                        </label>

                        <div className="grid gap-5 md:grid-cols-2">
                            <SearchableSelect
                                label="Parent"
                                value={form.data.parent ?? 0}
                                onChange={(value) => form.setData("parent", Number(value || 0))}
                                options={parentSelectOptions}
                                placeholder="Pilih parent footer"
                                searchPlaceholder="Cari parent footer..."
                                emptyText="Parent footer tidak ditemukan"
                                clearable={false}
                                getOptionValue={(option) => option.id}
                                getOptionLabel={(option) => option.content}
                                getSearchText={(option) => option.content}
                            />

                            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                                <span className="">Urutan</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.data.idx_content}
                                    onChange={(e) => form.setData("idx_content", e.target.value)}
                                    placeholder="Otomatis jika kosong"
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                                />
                            </label>
                        </div>

                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                            <span className="">URL</span>
                            <input
                                value={form.data.url}
                                onChange={(e) => form.setData("url", e.target.value)}
                                placeholder="https://... atau kosongkan jika tidak perlu"
                                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.url ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {form.errors.url && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.url}</p>}
                        </label>

                        <IconPicker
                            label="Icon Class"
                            value={form.data.icon}
                            onChange={(value) => form.setData("icon", value)}
                            error={form.errors.icon}
                            placeholder="Cari icon footer..."
                        />

                        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Image</span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
                                    className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                />
                                {form.errors.image && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.image}</p>}
                            </label>

                            {isEdit && item?.image && (
                                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3">
                                    <img src={item.image} alt={item.content || "Preview"} className="h-16 w-24 rounded-xl object-cover" />
                                    <div>
                                        <p className="text-sm font-black text-slate-800">Gambar saat ini</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">Upload file baru hanya jika ingin mengganti gambar.</p>
                                    </div>
                                </div>
                            )}

                            {!isEdit && !form.data.image && (
                                <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-400">
                                    <ImageIcon className="h-4 w-4" /> Gambar bersifat opsional.
                                </div>
                            )}
                        </div>
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
                            <Save className="h-4 w-4" /> {form.processing ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
