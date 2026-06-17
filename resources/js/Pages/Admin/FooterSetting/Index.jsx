import React, { useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Image as ImageIcon, Save, Settings2 } from "lucide-react";

import AdminLayout from "../../../Layouts/AdminLayout";
import { alertError, alertSuccess, confirmUpdate } from "../../../Utils/swal";

export default function Index({ meta = {}, data = {} }) {
    const { props } = usePage();
    const flash = props?.flash || {};
    const setting = data?.setting || {};

    const form = useForm({
        logo: null,
        logo_path: setting?.logo_path_raw || setting?.logo_path || "",
        description: setting?.description || "",
        copyright_text: setting?.copyright_text || "",
        bottom_text: setting?.bottom_text || "",
        statusenabled: setting?.statusenabled ?? true,
    });

    useEffect(() => {
        if (flash?.success) {
            alertSuccess({ title: "Berhasil", text: flash.success });
        }
    }, [flash?.success]);

    const submit = async (e) => {
        e.preventDefault();

        const result = await confirmUpdate({
            title: "Perbarui Pengaturan Footer?",
            text: "Logo, deskripsi, dan teks bawah footer akan diperbarui pada portal.",
            confirmButtonText: "Ya, Perbarui",
        });

        if (!result.isConfirmed) return;

        form.post("/admin/footer-setting", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Diperbarui",
                    text: "Pengaturan footer berhasil diperbarui.",
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Memperbarui",
                    text: "Periksa kembali data pengaturan footer.",
                });
            },
        });
    };

    return (
        <>
            <Head title={meta?.title || "Pengaturan Footer"} />

            <AdminLayout
                title={meta?.title || "Pengaturan Footer"}
                subtitle={meta?.subtitle || "Kelola bagian global footer portal PECUT."}
            >
                <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
                    <form
                        onSubmit={submit}
                        className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200"
                    >
                        <div className="mb-6 flex items-start gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                                <Settings2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                                    Global Footer
                                </p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">
                                    Informasi Utama Footer
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Data ini mengatur logo, deskripsi bagian kiri, copyright, dan tulisan kecil bawah footer.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Logo Footer
                                </span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                    onChange={(e) => form.setData("logo", e.target.files?.[0] || null)}
                                    className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                />
                                {form.errors.logo && (
                                    <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.logo}</p>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Path Logo Manual
                                </span>
                                <input
                                    value={form.data.logo_path || ""}
                                    onChange={(e) => form.setData("logo_path", e.target.value)}
                                    placeholder="/images/logo-pecut-full-transparan.png"
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                                <p className="mt-2 text-xs font-semibold text-slate-400">
                                    Boleh dikosongkan jika memakai upload logo. Jika diisi, gunakan path seperti /images/logo-pecut-full-transparan.png atau URL lengkap.
                                </p>
                                {form.errors.logo_path && (
                                    <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.logo_path}</p>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Deskripsi Footer <span className="text-rose-500">*</span>
                                </span>
                                <textarea
                                    value={form.data.description || ""}
                                    onChange={(e) => form.setData("description", e.target.value)}
                                    rows={5}
                                    placeholder="Tulis deskripsi singkat portal..."
                                    className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-sky-300 ${form.errors.description ? "border-rose-300" : "border-slate-200"}`}
                                />
                                {form.errors.description && (
                                    <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.description}</p>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Copyright
                                </span>
                                <input
                                    value={form.data.copyright_text || ""}
                                    onChange={(e) => form.setData("copyright_text", e.target.value)}
                                    placeholder="© 2026 PECUT Kota Kediri..."
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                                {form.errors.copyright_text && (
                                    <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.copyright_text}</p>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Teks Bawah Kanan
                                </span>
                                <input
                                    value={form.data.bottom_text || ""}
                                    onChange={(e) => form.setData("bottom_text", e.target.value)}
                                    placeholder="PECUT · Portal Efisien Cepat Mudah Terpadu"
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                                {form.errors.bottom_text && (
                                    <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.bottom_text}</p>
                                )}
                            </label>

                            <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <input
                                    type="checkbox"
                                    checked={Boolean(form.data.statusenabled)}
                                    onChange={(e) => form.setData("statusenabled", e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span>
                                    <span className="block text-sm font-black text-slate-800">
                                        Aktifkan pengaturan footer
                                    </span>
                                    <span className="block text-xs font-semibold text-slate-400">
                                        Jika nonaktif, footer akan memakai data default dari sistem.
                                    </span>
                                </span>
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {form.processing ? "Menyimpan..." : "Simpan Pengaturan"}
                            </button>
                        </div>
                    </form>

                    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Preview
                                </p>
                                <h3 className="text-lg font-black text-slate-950">
                                    Tampilan Bagian Kiri Footer
                                </h3>
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
                            <div className="inline-flex rounded-xl bg-white px-3 py-1 shadow-xl shadow-sky-950/20">
                                <img
                                    src={setting?.logo_path || "/images/logo-pecut-full-transparan.png"}
                                    alt="Preview logo footer"
                                    className="h-11 max-w-[260px] object-contain"
                                />
                            </div>

                            <p className="mt-7 text-sm leading-8 text-slate-300">
                                {form.data.description || "Deskripsi footer akan tampil di sini."}
                            </p>

                            <div className="mt-8 border-t border-white/10 pt-5 text-xs font-semibold text-slate-400">
                                <p>{form.data.copyright_text || "Copyright footer"}</p>
                                <p className="mt-2 text-sky-300">
                                    {form.data.bottom_text || "Teks bawah kanan"}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </AdminLayout>
        </>
    );
}
