import React, { useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { FileUp, Save, X } from "lucide-react";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../../Utils/swal";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";

function guessTypeFromFile(file) {
    if (!file?.name) return "";

    const parts = String(file.name).split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export default function PanduanFormModal({ show, item = null, fileTypes = [], onClose }) {
    const isEdit = Boolean(item?.id);

    const form = useForm({
        name_file: "",
        description: "",
        typefile: "",
        berkas: null,
        _method: "",
    });

    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            form.setData({
                name_file: item?.name_file || "",
                description: item?.description || "",
                typefile: item?.typefile || "",
                berkas: null,
                _method: "",
            });
        } else {
            form.setData({
                name_file: "",
                description: "",
                typefile: "",
                berkas: null,
                _method: "",
            });
        }

        form.clearErrors();
    }, [show, item?.id]);

    const selectedTypeLabel = useMemo(() => {
        if (!form.data.typefile) return "Belum dipilih";
        return fileTypes.find((type) => type.id === form.data.typefile)?.text || form.data.typefile.toUpperCase();
    }, [form.data.typefile, fileTypes]);

    if (!show) return null;

    const submit = async (e) => {
        e.preventDefault();

        const result = isEdit
            ? await confirmUpdate({
                  title: "Perbarui File Panduan?",
                  text: "Perubahan file panduan akan disimpan ke sistem.",
              })
            : await confirmSave({
                  title: "Simpan File Panduan?",
                  text: "File panduan baru akan ditambahkan ke halaman publik.",
              });

        if (!result.isConfirmed) return;

        const url = isEdit ? `/admin/panduan/${item.id}` : "/admin/panduan";

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
                        ? "File panduan berhasil diperbarui."
                        : "File panduan berhasil ditambahkan.",
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

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        form.setData("berkas", file);

        if (file && !form.data.typefile) {
            const guessedType = guessTypeFromFile(file);
            if (guessedType) {
                form.setData((current) => ({
                    ...current,
                    berkas: file,
                    typefile: guessedType,
                }));
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-visible rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {isEdit ? "Edit Panduan" : "Tambah Panduan"}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit ? "Perbarui File Panduan" : "Tambah File Panduan"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Tipe saat ini: <span className="font-black text-slate-700">{selectedTypeLabel}</span>
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
                                Nama File <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.data.name_file}
                                onChange={(e) => form.setData("name_file", e.target.value)}
                                placeholder="Contoh: Panduan Penggunaan PECUT"
                                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.name_file ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {form.errors.name_file && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.name_file}</p>}
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Deskripsi <span className="text-rose-500">*</span>
                            </span>
                            <textarea
                                value={form.data.description}
                                onChange={(e) => form.setData("description", e.target.value)}
                                rows={4}
                                placeholder="Tuliskan deskripsi singkat isi dokumen panduan..."
                                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300 ${form.errors.description ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {form.errors.description && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.description}</p>}
                        </label>

                        <SearchableSelect
                            label="Tipe File"
                            required
                            value={form.data.typefile || ""}
                            onChange={(value) => form.setData("typefile", value || "")}
                            options={fileTypes}
                            error={form.errors.typefile}
                            placeholder="Pilih tipe file..."
                            searchPlaceholder="Cari tipe file..."
                            emptyText="Tipe file tidak ditemukan"
                            getOptionValue={(type) => type.id}
                            getOptionLabel={(type) => type.text}
                            getSearchText={(type) => `${type.id} ${type.text}`}
                        />

                        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Upload Berkas {isEdit ? "" : <span className="text-rose-500">*</span>}
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.dot,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                />
                                {form.errors.berkas && <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.berkas}</p>}
                            </label>

                            {isEdit && item?.asset_file ? (
                                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                                        <FileUp className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-800">Berkas saat ini</p>
                                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">{item.asset_file}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-400">Upload file baru hanya jika ingin mengganti berkas.</p>
                                    </div>
                                </div>
                            ) : null}

                            {!isEdit && !form.data.berkas ? (
                                <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-400">
                                    <FileUp className="h-4 w-4" /> Berkas wajib diupload untuk data baru.
                                </div>
                            ) : null}
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
