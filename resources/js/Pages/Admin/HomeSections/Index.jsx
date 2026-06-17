import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import {
    AppWindow,
    Boxes,
    Edit3,
    Layers3,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { DynamicIcon } from "../../../Utils/iconRegistry";
import { alertError, alertSuccess, confirmDelete } from "../../../Utils/swal";
import SectionFormModal from "./Partials/SectionFormModal";
import SectionItemsModal from "./Partials/SectionItemsModal";

function StatCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-950">{value ?? 0}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

function EmptyState({ onCreate }) {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
                <Layers3 className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-black text-slate-700">Section beranda belum tersedia</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">
                Tambahkan section untuk menampilkan aplikasi pilihan pada halaman beranda.
            </p>
            <button
                type="button"
                onClick={onCreate}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
            >
                <Plus className="h-4 w-4" /> Tambah Section
            </button>
        </div>
    );
}

function AppLogo({ app }) {
    if (app?.image) {
        return <img src={app.image} alt={app.title || app.name} className="h-10 w-10 rounded-2xl object-contain" />;
    }

    if (app?.icon) {
        return <DynamicIcon name={app.icon} className="h-5 w-5" />;
    }

    return <AppWindow className="h-5 w-5" />;
}

export default function Index({ meta, filter, data }) {
    const [search, setSearch] = useState(filter?.search || "");
    const [sectionModal, setSectionModal] = useState({ show: false, item: null });
    const [itemModal, setItemModal] = useState({ show: false, section: null });

    const stats = data?.stats || {};
    const sections = Array.isArray(data?.sections) ? data.sections : [];
    const appOptions = Array.isArray(data?.app_options) ? data.app_options : [];

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/home-sections",
            { search },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const destroySection = async (section) => {
        const result = await confirmDelete({
            title: "Hapus Section?",
            itemName: section.title,
            text: "Semua item aplikasi di dalam section ini juga akan terhapus.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/home-sections/sections/${section.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: "Section beranda berhasil dihapus.",
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Menghapus",
                    text: "Section beranda gagal dihapus.",
                });
            },
        });
    };

    const destroyItem = async (item) => {
        const result = await confirmDelete({
            title: "Hapus Aplikasi dari Section?",
            itemName: item?.app?.title || item?.app?.name || "aplikasi",
            text: "Aplikasi hanya dihapus dari section beranda, bukan dari data Apps utama.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/home-sections/items/${item.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: "Aplikasi berhasil dihapus dari section.",
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Menghapus",
                    text: "Aplikasi gagal dihapus dari section.",
                });
            },
        });
    };

    return (
        <AdminLayout 
            title={meta?.title || "Section Beranda"}
            subtitle={meta?.subtitle || "Kelola kelompok aplikasi pilihan yang tampil pada halaman beranda, seperti layanan prioritas, layanan masyarakat, atau layanan ASN."}
            actions={(
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setSectionModal({ show: true, item: null })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Plus className="h-4 w-4" /> Tambah Section
                    </button>
                </div>
            )}
        >
            <Head title={meta?.title || "Section Beranda"} />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard label="Total Section" value={stats.sections} icon={Layers3} />
                    <StatCard label="Item Aplikasi" value={stats.items} icon={Boxes} />
                    <StatCard label="Apps Aktif" value={stats.active_apps} icon={AppWindow} />
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100">
                    <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-black text-slate-800">Daftar Section</p>
                            <p className="mt-1 text-xs font-semibold text-slate-400">Section tampil berurutan berdasarkan field urutan.</p>
                        </div>

                        <div className="flex w-full gap-2 sm:max-w-md">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari section atau aplikasi..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                            </div>
                            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white hover:bg-sky-700">
                                <Search className="h-4 w-4" /> Cari
                            </button>
                        </div>
                    </form>
                </div>

                {sections.length ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {sections.map((section) => {
                            const children = Array.isArray(section.children) ? section.children : [];

                            return (
                                <div key={section.id} className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
                                    <div className="border-b border-slate-100 p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                                                        Urutan {section.sort_order ?? 0}
                                                    </span>
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                                        {children.length} aplikasi
                                                    </span>
                                                </div>
                                                <h3 className="mt-3 text-xl font-black text-slate-950">{section.title}</h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                    {section.description || "Tidak ada deskripsi section."}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSectionModal({ show: true, item: section })}
                                                    className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                    title="Edit section"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => destroySection(section)}
                                                    className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                    title="Hapus section"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setItemModal({ show: true, section })}
                                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                        >
                                            <Plus className="h-4 w-4" /> Tambah Aplikasi
                                        </button>
                                    </div>

                                    <div className="max-h-[420px] overflow-y-auto p-4">
                                        {children.length ? (
                                            <div className="space-y-3">
                                                {children.map((item) => {
                                                    const app = item.app || {};

                                                    return (
                                                        <div key={item.id} className="flex items-start justify-between gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                                            <div className="flex min-w-0 gap-3">
                                                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sky-600 ring-1 ring-slate-100">
                                                                    <AppLogo app={app} />
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <p className="font-black text-slate-900">{app.title || app.name}</p>
                                                                        {app.is_sso ? (
                                                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">SSO</span>
                                                                        ) : null}
                                                                    </div>
                                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                                        {app.description || "Tidak ada deskripsi aplikasi."}
                                                                    </p>
                                                                    <p className="mt-2 text-[11px] font-bold text-slate-400">
                                                                        {app.category?.title || "-"} · {app.urusan?.title || "-"} · Urutan {item.sort_order ?? 0}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => destroyItem(item)}
                                                                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-rose-500 ring-1 ring-rose-100 hover:bg-rose-50"
                                                                title="Hapus dari section"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                                                <p className="text-sm font-black text-slate-600">Belum ada aplikasi di section ini.</p>
                                                <p className="mt-1 text-xs font-semibold text-slate-400">Klik tambah aplikasi untuk mengisi section.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState onCreate={() => setSectionModal({ show: true, item: null })} />
                )}
            </div>

            <SectionFormModal
                show={sectionModal.show}
                item={sectionModal.item}
                onClose={() => setSectionModal({ show: false, item: null })}
            />

            <SectionItemsModal
                show={itemModal.show}
                section={itemModal.section}
                appOptions={appOptions}
                onClose={() => setItemModal({ show: false, section: null })}
            />
        </AdminLayout>
    );
}
