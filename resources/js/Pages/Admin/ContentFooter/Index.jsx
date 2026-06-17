import React, { useEffect, useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    AlertCircle,
    CheckCircle2,
    FileText,
    Image as ImageIcon,
    Link2,
    Plus,
    Rows3,
} from "lucide-react";

import AdminLayout from "../../../Layouts/AdminLayout";
import ContentFooterFilter from "./Partials/ContentFooterFilter";
import ContentFooterFormModal from "./Partials/ContentFooterFormModal";
import ContentFooterPagination from "./Partials/ContentFooterPagination";
import ContentFooterTree from "./Partials/ContentFooterTree";
import {
    alertError,
    alertSuccess,
    alertWarning,
    confirmDelete,
} from "../../../Utils/swal";

function MiniStat({ title, value, icon: Icon, tone = "sky" }) {
    const tones = {
        sky: "bg-sky-50 text-sky-700 ring-sky-100",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        violet: "bg-violet-50 text-violet-700 ring-violet-100",
        amber: "bg-amber-50 text-amber-700 ring-amber-100",
    };

    return (
        <div className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-950">
                        {Number(value || 0).toLocaleString("id-ID")}
                    </p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tones[tone] || tones.sky}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function collectIds(items = [], value = true) {
    const ids = {};

    items.forEach((item) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
            ids[item.id] = value;
        }
    });

    return ids;
}

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const { props } = usePage();
    const flash = props?.flash || {};
    const errors = props?.errors || {};

    const rows = Array.isArray(data?.footers?.items) ? data.footers.items : [];
    const pagination = data?.footers?.meta || {};
    const stats = data?.stats || {};
    const parentOptions = Array.isArray(data?.parent_options) ? data.parent_options : [];

    const [expanded, setExpanded] = useState(() => collectIds(rows, true));
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [defaultParent, setDefaultParent] = useState(0);

    useEffect(() => {
        setExpanded(collectIds(rows, true));
    }, [rows]);

    useEffect(() => {
        if (flash?.success) {
            alertSuccess({ title: "Berhasil", text: flash.success });
        }
    }, [flash?.success]);

    useEffect(() => {
        if (errors?.delete) {
            alertWarning({ title: "Tidak Bisa Dihapus", text: errors.delete });
        }
    }, [errors?.delete]);

    const allExpanded = useMemo(() => {
        const ids = Object.keys(collectIds(rows, true));
        return ids.length > 0 && ids.every((id) => expanded[id] !== false);
    }, [rows, expanded]);

    const toggle = (id) => {
        setExpanded((current) => ({
            ...current,
            [id]: current[id] === false,
        }));
    };

    const toggleAll = () => {
        if (allExpanded) {
            setExpanded(collectIds(rows, false));
            return;
        }

        setExpanded(collectIds(rows, true));
    };

    const openCreateGroup = () => {
        setEditingItem(null);
        setDefaultParent(0);
        setModalOpen(true);
    };

    const openCreateChild = (parent) => {
        setEditingItem(null);
        setDefaultParent(parent?.id || 0);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setDefaultParent(item?.parent || 0);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
        setDefaultParent(0);
    };

    const destroy = async (item) => {
        const children = Array.isArray(item.children) ? item.children : [];

        if (children.length > 0) {
            alertWarning({
                title: "Tidak Bisa Dihapus",
                text: `Content "${item.content}" masih memiliki ${children.length} child. Hapus child terlebih dahulu.`,
            });
            return;
        }

        const result = await confirmDelete({
            title: "Hapus Content Footer?",
            itemName: item.content,
            text: "Content footer akan dinonaktifkan dari tampilan portal.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/content-footer/${item.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: `Content "${item.content}" berhasil dihapus.`,
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Menghapus",
                    text: "Terjadi kesalahan saat menghapus content footer.",
                });
            },
        });
    };

    return (
        <>
            <Head title={meta?.title || "Content Footer"} />

            <AdminLayout
                title={meta?.title || "Content Footer"}
                subtitle={meta?.subtitle || "Kelola konten footer portal PECUT."}
                actions={(
                    <button
                        type="button"
                        onClick={openCreateGroup}
                        className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Plus className="h-4 w-4" /> Tambah Group
                    </button>
                )}
            >
                <div className="space-y-6">
                    {errors?.content && (
                        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-rose-800">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5" />
                                <p className="text-sm font-bold">{errors.content}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        <MiniStat title="Total" value={stats.total} icon={FileText} tone="sky" />
                        <MiniStat title="Group" value={stats.group_total} icon={Rows3} tone="violet" />
                        <MiniStat title="Content" value={stats.content_total} icon={CheckCircle2} tone="emerald" />
                        <MiniStat title="Dengan URL" value={stats.with_url_total} icon={Link2} tone="amber" />
                        <MiniStat title="Dengan Gambar" value={stats.with_image_total} icon={ImageIcon} tone="sky" />
                    </div>

                    <ContentFooterFilter filter={filter} />

                    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                                    Footer Builder
                                </p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">
                                    Struktur Content Footer
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Kelola group footer dan item child seperti navigasi, kontak, sosial media, atau informasi bantuan.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50"
                            >
                                <Rows3 className="h-4 w-4" /> {allExpanded ? "Collapse Semua" : "Expand Semua"}
                            </button>
                        </div>

                        <ContentFooterTree
                            rows={rows}
                            expanded={expanded}
                            onToggle={toggle}
                            onCreateChild={openCreateChild}
                            onEdit={openEdit}
                            onDelete={destroy}
                        />
                    </section>

                    <ContentFooterPagination meta={pagination} filter={filter} />
                </div>

                <ContentFooterFormModal
                    show={modalOpen}
                    item={editingItem}
                    defaultParent={defaultParent}
                    parentOptions={parentOptions}
                    onClose={closeModal}
                />
            </AdminLayout>
        </>
    );
}
