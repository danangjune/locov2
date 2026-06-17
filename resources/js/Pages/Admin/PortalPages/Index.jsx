import React, { useEffect, useMemo, useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Edit3, Eye, FileText, Image as ImageIcon, Layers3, Plus, Save, Trash2 } from "lucide-react";
import { alertError, alertSuccess, confirmDelete, confirmUpdate } from "../../../Utils/swal";
import SectionFormModal from "./Partials/SectionFormModal";

function publicHref(slug) {
    if (slug === "about") return "/about";
    if (slug === "privasi-data") return "/privasi-data";
    if (slug === "syarat-ketentuan") return "/syarat-ketentuan";
    return `/${slug}`;
}

export default function Index({ meta, filter, data }) {
    const pages = Array.isArray(data?.pages) ? data.pages : [];
    const selectedPage = data?.selected_page || pages[0] || null;
    const [activePage, setActivePage] = useState(selectedPage);
    const [sectionModal, setSectionModal] = useState({ show: false, item: null });

    useEffect(() => {
        setActivePage(selectedPage);
    }, [selectedPage?.id]);

    const pageForm = useForm({
        title: activePage?.title || "",
        subtitle: activePage?.subtitle || "",
        description: activePage?.description || "",
        hero_image: null,
        statusenabled: activePage?.statusenabled ?? true,
    });

    useEffect(() => {
        pageForm.setData({
            title: activePage?.title || "",
            subtitle: activePage?.subtitle || "",
            description: activePage?.description || "",
            hero_image: null,
            statusenabled: activePage?.statusenabled ?? true,
        });
        pageForm.clearErrors();
    }, [activePage?.id]);

    const sections = useMemo(() => {
        return Array.isArray(activePage?.sections) ? activePage.sections : [];
    }, [activePage]);

    const selectPage = (page) => {
        router.get(
            "/admin/portal-pages",
            { slug: page.slug },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const savePage = async (e) => {
        e.preventDefault();
        if (!activePage?.id) return;

        const result = await confirmUpdate({
            title: "Perbarui Halaman?",
            text: `Perubahan halaman ${activePage.label || activePage.title} akan disimpan.`,
            confirmButtonText: "Ya, Perbarui",
        });

        if (!result.isConfirmed) return;

        pageForm.transform((formData) => ({
            ...formData,
            _method: "PUT",
        }));

        pageForm.post(`/admin/portal-pages/${activePage.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Diperbarui",
                    text: "Halaman portal berhasil diperbarui.",
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Memperbarui",
                    text: "Periksa kembali data halaman yang belum sesuai.",
                });
            },
            onFinish: () => pageForm.transform((formData) => formData),
        });
    };

    const deleteSection = async (section) => {
        const result = await confirmDelete({
            title: "Hapus Section?",
            itemName: section.title,
            text: "Section yang dihapus tidak akan tampil lagi di halaman public.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/portal-pages/sections/${section.id}`, {
            preserveScroll: true,
            onSuccess: () => alertSuccess({ title: "Berhasil Dihapus", text: "Section berhasil dihapus." }),
            onError: () => alertError({ title: "Gagal Menghapus", text: "Section gagal dihapus." }),
        });
    };

    return (
        <AdminLayout 
            title={meta?.title || "Halaman Portal"}
            subtitle="Kelola halaman informasi seperti Tentang PECUT, Privasi Data, dan Syarat & Ketentuan tanpa mengubah kode."
            actions={(
                <div className="flex flex-wrap gap-3">
                    <a href={publicHref(activePage.slug)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700">
                        <Eye className="h-4 w-4" /> Lihat Public
                    </a>
                </div>
            )}
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    {pages.map((page) => {
                        const active = page.id === activePage?.id;
                        return (
                            <button
                                key={page.id}
                                type="button"
                                onClick={() => selectPage(page)}
                                className={[
                                    "rounded-[1.5rem] border p-5 text-left transition",
                                    active
                                        ? "border-sky-300 bg-sky-50 shadow-lg shadow-sky-100"
                                        : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-600 shadow-sm">
                                        <FileText className="h-5 w-5" />
                                    </span>
                                    <span className={active ? "text-xs font-black uppercase tracking-widest text-sky-700" : "text-xs font-black uppercase tracking-widest text-slate-400"}>
                                        {page.statusenabled ? "Aktif" : "Nonaktif"}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-black text-slate-900">{page.label || page.title}</h3>
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{page.description}</p>
                            </button>
                        );
                    })}
                </div>

                {activePage ? (
                    <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
                        <form onSubmit={savePage} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-sky-600">Konten Halaman</p>
                                    <h2 className="mt-1 text-xl font-black text-slate-950">{activePage.label}</h2>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">/{activePage.slug}</span>
                            </div>

                            <div className="mt-6 grid gap-5">
                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Judul</span>
                                    <input
                                        value={pageForm.data.title}
                                        onChange={(e) => pageForm.setData("title", e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                                    />
                                    {pageForm.errors.title ? <p className="mt-2 text-xs font-bold text-rose-600">{pageForm.errors.title}</p> : null}
                                </label>

                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtitle</span>
                                    <input
                                        value={pageForm.data.subtitle || ""}
                                        onChange={(e) => pageForm.setData("subtitle", e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi</span>
                                    <textarea
                                        rows={5}
                                        value={pageForm.data.description || ""}
                                        onChange={(e) => pageForm.setData("description", e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-sky-300"
                                    />
                                </label>

                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <label className="block">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Image</span>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={(e) => pageForm.setData("hero_image", e.target.files?.[0] || null)}
                                            className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                                        />
                                    </label>
                                    {activePage.hero_image ? (
                                        <div className="mt-4 overflow-hidden rounded-2xl bg-white p-3">
                                            <img src={activePage.hero_image} alt={activePage.title} className="h-40 w-full rounded-xl object-cover" />
                                        </div>
                                    ) : (
                                        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-400">
                                            <ImageIcon className="h-4 w-4" /> Hero image masih kosong.
                                        </div>
                                    )}
                                </div>

                                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(pageForm.data.statusenabled)}
                                        onChange={(e) => pageForm.setData("statusenabled", e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    <span className="text-sm font-black text-slate-700">Halaman aktif</span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={pageForm.processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" /> {pageForm.processing ? "Menyimpan..." : "Simpan Halaman"}
                                </button>
                            </div>
                        </form>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-sky-600">Section</p>
                                    <h2 className="mt-1 text-xl font-black text-slate-950">Isi Halaman</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSectionModal({ show: true, item: null })}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" /> Tambah
                                </button>
                            </div>

                            <div className="mt-6 space-y-3">
                                {sections.length ? (
                                    sections.map((section) => (
                                        <div key={section.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="flex gap-4">
                                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sky-600 shadow-sm">
                                                    <Layers3 className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="font-black text-slate-900">{section.title}</h3>
                                                            {section.subtitle ? <p className="mt-1 text-sm font-semibold text-slate-500">{section.subtitle}</p> : null}
                                                        </div>
                                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">
                                                            Urutan {section.sort_order ?? 0}
                                                        </span>
                                                    </div>
                                                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{section.content || "Belum ada isi section."}</p>
                                                    {section.image ? (
                                                        <img src={section.image} alt={section.title} className="mt-4 h-28 w-full rounded-2xl object-cover" />
                                                    ) : null}
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSectionModal({ show: true, item: section })}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm hover:text-sky-700"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" /> Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteSection(section)}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-rose-600 shadow-sm hover:bg-rose-50"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                                        <p className="font-black text-slate-700">Belum ada section</p>
                                        <p className="mt-1 text-sm text-slate-400">Tambahkan section untuk mengisi halaman public.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <SectionFormModal
                show={sectionModal.show}
                page={activePage}
                item={sectionModal.item}
                onClose={() => setSectionModal({ show: false, item: null })}
            />
        </AdminLayout>
    );
}
