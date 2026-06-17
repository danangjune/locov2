import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Boxes, Building2, Database, Edit3, Plus, Search, Trash2, LayoutDashboard } from "lucide-react";
import { DynamicIcon } from "../../../Utils/iconRegistry";
import { alertError, alertSuccess, confirmDelete } from "../../../Utils/swal";
import CategoryFormModal from "./Partials/CategoryFormModal";
import UrusanFormModal from "./Partials/UrusanFormModal";
import AppFromFormModal from "./Partials/AppFromFormModal";

const tabs = [
    { key: "categories", label: "Kategori", icon: Boxes },
    { key: "urusan", label: "Urusan", icon: Building2 },
    { key: "app_from", label: "Sumber Aplikasi", icon: Database },
];

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

function EmptyState({ title = "Data belum tersedia" }) {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
                <Database className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-black text-slate-700">{title}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">Tambahkan data referensi baru dari tombol tambah.</p>
        </div>
    );
}

function BadgeCount({ value }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {value ?? 0} aplikasi
        </span>
    );
}

export default function Index({ meta, filter, data }) {
    const [activeTab, setActiveTab] = useState(filter?.tab || "categories");
    const [search, setSearch] = useState(filter?.search || "");

    const [categoryModal, setCategoryModal] = useState({ show: false, item: null });
    const [urusanModal, setUrusanModal] = useState({ show: false, item: null });
    const [appFromModal, setAppFromModal] = useState({ show: false, item: null });

    const stats = data?.stats || {};
    const categories = Array.isArray(data?.categories) ? data.categories : [];
    const urusan = Array.isArray(data?.urusan) ? data.urusan : [];
    const appFrom = Array.isArray(data?.app_from) ? data.app_from : [];

    const currentRows = useMemo(() => {
        if (activeTab === "categories") return categories;
        if (activeTab === "urusan") return urusan;
        return appFrom;
    }, [activeTab, categories, urusan, appFrom]);

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/references",
            { tab: activeTab, search },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        router.get(
            "/admin/references",
            { tab, search },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const openCreate = () => {
        if (activeTab === "categories") setCategoryModal({ show: true, item: null });
        if (activeTab === "urusan") setUrusanModal({ show: true, item: null });
        if (activeTab === "app_from") setAppFromModal({ show: true, item: null });
    };

    const openEdit = (item) => {
        if (activeTab === "categories") setCategoryModal({ show: true, item });
        if (activeTab === "urusan") setUrusanModal({ show: true, item });
        if (activeTab === "app_from") setAppFromModal({ show: true, item });
    };

    const destroyItem = async (item) => {
        const label = item?.title || item?.name || "data";

        const result = await confirmDelete({
            title: "Hapus Referensi?",
            itemName: label,
            text: "Referensi hanya bisa dihapus jika belum digunakan oleh aplikasi.",
        });

        if (!result.isConfirmed) return;

        const urlMap = {
            categories: `/admin/references/categories/${item.id}`,
            urusan: `/admin/references/urusan/${item.id}`,
            app_from: `/admin/references/app-from/${item.id}`,
        };

        router.delete(urlMap[activeTab], {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: "Data referensi berhasil dihapus.",
                });
            },
            onError: (errors) => {
                alertError({
                    title: "Gagal Menghapus",
                    text: errors?.delete || "Data referensi gagal dihapus.",
                });
            },
        });
    };

    const activeLabel = tabs.find((tab) => tab.key === activeTab)?.label || "Referensi";

    return (
        <AdminLayout 
            title={meta?.title || "Master Referensi"}
            subtitle={meta?.subtitle || "Kelola kategori layanan, urusan/perangkat daerah, dan sumber aplikasi yang dipakai pada data Apps."}
            actions={(
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Plus className="h-4 w-4" /> Tambah {activeLabel}
                    </button>
                </div>
            )}
        >
            <Head title={meta?.title || "Master Referensi"} />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Kategori" value={stats.categories} icon={Boxes} />
                    <StatCard label="Urusan" value={stats.urusan} icon={Building2} />
                    <StatCard label="Sumber Aplikasi" value={stats.app_from} icon={Database} />
                    <StatCard label="Total Apps" value={stats.apps} icon={Database} />
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = activeTab === tab.key;

                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => changeTab(tab.key)}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition",
                                            active ? "bg-sky-600 text-white shadow-lg shadow-sky-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4" /> {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <form onSubmit={submitSearch} className="flex w-full gap-2 xl:max-w-md">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari referensi..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                            </div>
                            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white hover:bg-sky-700">
                                <Search className="h-4 w-4" /> Cari
                            </button>
                        </form>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
                    {currentRows.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Data</th>
                                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Keterangan</th>
                                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Dipakai</th>
                                        <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentRows.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                                                        {activeTab === "categories" && item.icon ? (
                                                            <DynamicIcon name={item.icon} className="h-5 w-5" />
                                                        ) : activeTab === "urusan" && item.icon_name ? (
                                                            <DynamicIcon name={item.icon_name} className="h-5 w-5" />
                                                        ) : (
                                                            <LayoutDashboard className="h-5 w-5" />
                                                        )}
                                                    </span>
                                                    <div>
                                                        <p className="font-black text-slate-900">{item.title || item.name}</p>
                                                        <p className="mt-1 text-xs font-semibold text-slate-400">ID: {item.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="max-w-md px-5 py-4 text-sm leading-6 text-slate-500">
                                                {activeTab === "categories" ? item.sub_title || "-" : activeTab === "urusan" ? item.description || "-" : "Sumber asal aplikasi"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <BadgeCount value={item.apps_count} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(item)}
                                                        className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroyItem(item)}
                                                        className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6">
                            <EmptyState title={`${activeLabel} belum tersedia`} />
                        </div>
                    )}
                </div>
            </div>

            <CategoryFormModal
                show={categoryModal.show}
                item={categoryModal.item}
                onClose={() => setCategoryModal({ show: false, item: null })}
            />
            <UrusanFormModal
                show={urusanModal.show}
                item={urusanModal.item}
                onClose={() => setUrusanModal({ show: false, item: null })}
            />
            <AppFromFormModal
                show={appFromModal.show}
                item={appFromModal.item}
                onClose={() => setAppFromModal({ show: false, item: null })}
            />
        </AdminLayout>
    );
}
