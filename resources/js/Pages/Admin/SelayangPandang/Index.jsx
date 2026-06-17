import React, { useEffect, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    BarChart3,
    Edit3,
    FileText,
    Image as ImageIcon,
    Layers3,
    Plus,
    Save,
    Trash2,
} from "lucide-react";

import AdminLayout from "../../../Layouts/AdminLayout";
import SectionFormModal from "./Partials/SectionFormModal";
import StatFormModal from "./Partials/StatFormModal";
import {
    alertError,
    alertSuccess,
    confirmDelete,
    confirmUpdate,
} from "../../../Utils/swal";

function InfoCard({ title, value, icon: Icon, tone = "sky" }) {
    const tones = {
        sky: "bg-sky-50 text-sky-700 ring-sky-100",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        violet: "bg-violet-50 text-violet-700 ring-violet-100",
    };

    return (
        <div className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-950">
                        {value}
                    </p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tones[tone] || tones.sky}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function PageSettingForm({ page = {} }) {
    const form = useForm({
        title: page?.title || "",
        subtitle: page?.subtitle || "",
        description: page?.description || "",
        hero_image: null,
        remove_hero_image: false,
    });

    useEffect(() => {
        form.setData({
            title: page?.title || "",
            subtitle: page?.subtitle || "",
            description: page?.description || "",
            hero_image: null,
            remove_hero_image: false,
        });
        form.clearErrors();
    }, [page?.id]);

    const submit = async (event) => {
        event.preventDefault();

        const result = await confirmUpdate({
            title: "Perbarui Informasi Utama?",
            text: "Judul, deskripsi, dan hero image halaman Selayang Pandang akan diperbarui.",
        });

        if (!result.isConfirmed) return;

        form.transform((data) => ({
            ...data,
            _method: "PUT",
        }));

        form.post("/admin/selayang-pandang/page", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Diperbarui",
                    text: "Informasi utama Selayang Pandang berhasil disimpan.",
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Menyimpan",
                    text: "Periksa kembali data informasi utama.",
                });
            },
            onFinish: () => form.transform((data) => data),
        });
    };

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
            <div className="border-b border-slate-100 p-5">
                <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                    Informasi Utama
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                    Header Halaman Selayang Pandang
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                    Data ini digunakan untuk judul dan deskripsi halaman publik /kediri.
                </p>
            </div>

            <form onSubmit={submit} className="grid gap-5 p-5">
                <div className="grid gap-5 lg:grid-cols-2">
                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Judul Halaman <span className="text-rose-500">*</span>
                        </span>
                        <input
                            value={form.data.title}
                            onChange={(event) => form.setData("title", event.target.value)}
                            className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 ${form.errors.title ? "border-rose-300" : "border-slate-200"}`}
                            placeholder="Selayang Pandang Kota Kediri"
                        />
                        {form.errors.title ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.title}</p> : null}
                    </label>

                    <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Subtitle
                        </span>
                        <input
                            value={form.data.subtitle}
                            onChange={(event) => form.setData("subtitle", event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300"
                            placeholder="Kota Kediri dalam satu pandang"
                        />
                    </label>
                </div>

                <label className="block">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Deskripsi Hero
                    </span>
                    <textarea
                        value={form.data.description}
                        onChange={(event) => form.setData("description", event.target.value)}
                        rows={4}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-sky-300"
                        placeholder="Ringkasan profil Kota Kediri..."
                    />
                </label>

                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-center">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Hero Image Opsional
                            </span>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={(event) => form.setData("hero_image", event.target.files?.[0] || null)}
                                className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-sky-700"
                            />
                            {form.errors.hero_image ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.hero_image}</p> : null}

                            {page?.hero_image ? (
                                <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form.data.remove_hero_image)}
                                        onChange={(event) => form.setData("remove_hero_image", event.target.checked)}
                                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    Hapus hero image saat ini
                                </label>
                            ) : null}
                        </label>

                        <div className="overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-slate-200">
                            {page?.hero_image ? (
                                <img src={page.hero_image} alt="Hero" className="h-32 w-full rounded-xl object-cover" />
                            ) : (
                                <div className="grid h-32 place-items-center rounded-xl bg-slate-100 text-slate-400">
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" /> {form.processing ? "Menyimpan..." : "Simpan Informasi Utama"}
                    </button>
                </div>
            </form>
        </section>
    );
}

function SectionTable({ rows = [], onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Bagian</th>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Konten</th>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Urutan</th>
                        <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.length ? rows.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-4 align-top">
                                <div className="flex items-start gap-3">
                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="grid h-full place-items-center text-slate-400">
                                                <ImageIcon className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{item.title}</p>
                                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{item.subtitle || "Tidak ada subtitle."}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="max-w-xl px-5 py-4 align-top text-sm leading-7 text-slate-600">
                                <p className="line-clamp-3 whitespace-pre-line">{item.content || "Belum ada konten."}</p>
                            </td>
                            <td className="px-5 py-4 align-top text-sm font-black text-slate-700">{item.sort_order}</td>
                            <td className="px-5 py-4 align-top">
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => onEdit(item)} className="rounded-xl bg-sky-50 p-2 text-sky-700 hover:bg-sky-100" title="Edit">
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => onDelete(item)} className="rounded-xl bg-rose-50 p-2 text-rose-700 hover:bg-rose-100" title="Hapus">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-5 py-12 text-center text-sm font-bold text-slate-400">
                                Belum ada bagian Selayang Pandang.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function StatTable({ rows = [], onEdit, onDelete }) {
    return (
        <div className="grid gap-3 md:grid-cols-3">
            {rows.length ? rows.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-3xl font-black text-slate-950">{item.value}</p>
                            <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                            <p className="mt-3 text-xs font-bold text-slate-400">Urutan: {item.sort_order}</p>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => onEdit(item)} className="rounded-xl bg-sky-50 p-2 text-sky-700 hover:bg-sky-100" title="Edit">
                                <Edit3 className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => onDelete(item)} className="rounded-xl bg-rose-50 p-2 text-rose-700 hover:bg-rose-100" title="Hapus">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-400 md:col-span-3">
                    Belum ada statistik.
                </div>
            )}
        </div>
    );
}

export default function Index({ meta = {}, data = {} }) {
    const { props } = usePage();
    const flash = props?.flash || {};

    const page = data?.page || {};
    const sections = Array.isArray(data?.sections) ? data.sections : [];
    const stats = Array.isArray(data?.stats) ? data.stats : [];

    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [statModalOpen, setStatModalOpen] = useState(false);
    const [editingStat, setEditingStat] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            alertSuccess({ title: "Berhasil", text: flash.success });
        }
    }, [flash?.success]);

    const openCreateSection = () => {
        setEditingSection(null);
        setSectionModalOpen(true);
    };

    const openEditSection = (item) => {
        setEditingSection(item);
        setSectionModalOpen(true);
    };

    const openCreateStat = () => {
        setEditingStat(null);
        setStatModalOpen(true);
    };

    const openEditStat = (item) => {
        setEditingStat(item);
        setStatModalOpen(true);
    };

    const destroySection = async (item) => {
        const result = await confirmDelete({
            title: "Hapus Bagian?",
            itemName: item.title,
            text: "Bagian ini akan dinonaktifkan dari halaman publik.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/selayang-pandang/sections/${item.id}`, {
            preserveScroll: true,
            onError: () => alertError({ title: "Gagal Menghapus", text: "Bagian gagal dihapus." }),
        });
    };

    const destroyStat = async (item) => {
        const result = await confirmDelete({
            title: "Hapus Statistik?",
            itemName: `${item.value} ${item.label}`,
            text: "Statistik ini akan dinonaktifkan dari halaman publik.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/selayang-pandang/stats/${item.id}`, {
            preserveScroll: true,
            onError: () => alertError({ title: "Gagal Menghapus", text: "Statistik gagal dihapus." }),
        });
    };

    return (
        <>
            <Head title={meta?.title || "Selayang Pandang"} />

            <AdminLayout
                title={meta?.title || "Selayang Pandang"}
                subtitle={meta?.subtitle || "Kelola konten Selayang Pandang Kota Kediri."}
                actions={(
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={openCreateStat} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
                            <BarChart3 className="h-4 w-4" /> Tambah Statistik
                        </button>
                        <button type="button" onClick={openCreateSection} className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700">
                            <Plus className="h-4 w-4" /> Tambah Bagian
                        </button>
                    </div>
                )}
            >
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <InfoCard title="Bagian Aktif" value={sections.length} icon={Layers3} tone="sky" />
                        <InfoCard title="Statistik" value={stats.length} icon={BarChart3} tone="emerald" />
                        <InfoCard title="Halaman" value="/kediri" icon={FileText} tone="violet" />
                    </div>

                    <PageSettingForm page={page} />

                    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-sky-600">Bagian Konten</p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">Narasi Selayang Pandang</h2>
                                <p className="mt-1 text-sm text-slate-500">Setiap bagian tampil sebagai artikel pada halaman publik.</p>
                            </div>
                            <button type="button" onClick={openCreateSection} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
                                <Plus className="h-4 w-4" /> Tambah Bagian
                            </button>
                        </div>
                        <SectionTable rows={sections} onEdit={openEditSection} onDelete={destroySection} />
                    </section>

                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200">
                        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-sky-600">Statistik</p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">Angka Ringkas Kota Kediri</h2>
                            </div>
                            <button type="button" onClick={openCreateStat} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
                                <Plus className="h-4 w-4" /> Tambah Statistik
                            </button>
                        </div>
                        <StatTable rows={stats} onEdit={openEditStat} onDelete={destroyStat} />
                    </section>
                </div>

                <SectionFormModal
                    show={sectionModalOpen}
                    item={editingSection}
                    onClose={() => {
                        setSectionModalOpen(false);
                        setEditingSection(null);
                    }}
                />

                <StatFormModal
                    show={statModalOpen}
                    item={editingStat}
                    onClose={() => {
                        setStatModalOpen(false);
                        setEditingStat(null);
                    }}
                />
            </AdminLayout>
        </>
    );
}
