import React, { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    BookOpen,
    FileArchive,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileUp,
    Plus,
    Presentation,
} from "lucide-react";

import AdminLayout from "../../../Layouts/AdminLayout";
import PanduanFilter from "./Partials/PanduanFilter";
import PanduanFormModal from "./Partials/PanduanFormModal";
import PanduanPagination from "./Partials/PanduanPagination";
import PanduanTable from "./Partials/PanduanTable";
import {
    alertError,
    alertSuccess,
    confirmDelete,
} from "../../../Utils/swal";

function MiniStat({ title, value, icon: Icon, tone = "sky" }) {
    const tones = {
        sky: "bg-sky-50 text-sky-700 ring-sky-100",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        violet: "bg-violet-50 text-violet-700 ring-violet-100",
        amber: "bg-amber-50 text-amber-700 ring-amber-100",
        rose: "bg-rose-50 text-rose-700 ring-rose-100",
        indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
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

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const { props } = usePage();
    const flash = props?.flash || {};

    const rows = Array.isArray(data?.files?.items) ? data.files.items : [];
    const pagination = data?.files?.meta || {};
    const stats = data?.stats || {};
    const fileTypes = Array.isArray(data?.file_types) ? data.file_types : [];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            alertSuccess({ title: "Berhasil", text: flash.success });
        }
    }, [flash?.success]);

    const openCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const destroy = async (item) => {
        const result = await confirmDelete({
            title: "Hapus File Panduan?",
            itemName: item.name_file,
            text: "File panduan akan dinonaktifkan dari halaman publik.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/panduan/${item.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: `File panduan "${item.name_file}" berhasil dihapus.`,
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Menghapus",
                    text: "Terjadi kesalahan saat menghapus file panduan.",
                });
            },
        });
    };

    return (
        <>
            <Head title={meta?.title || "Panduan"} />

            <AdminLayout
                title={meta?.title || "Panduan"}
                subtitle={meta?.subtitle || "Kelola file panduan PECUT."}
                actions={(
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Plus className="h-4 w-4" /> Tambah Panduan
                    </button>
                )}
            >
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                        <MiniStat title="Total" value={stats.total} icon={BookOpen} tone="sky" />
                        <MiniStat title="PDF" value={stats.pdf_total} icon={FileText} tone="rose" />
                        <MiniStat title="Dokumen" value={stats.document_total} icon={FileArchive} tone="indigo" />
                        <MiniStat title="Excel" value={stats.spreadsheet_total} icon={FileSpreadsheet} tone="emerald" />
                        <MiniStat title="PPT" value={stats.presentation_total} icon={Presentation} tone="amber" />
                        <MiniStat title="Gambar" value={stats.image_total} icon={FileImage} tone="violet" />
                    </div>

                    <PanduanFilter filter={filter} fileTypes={fileTypes} />

                    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                                    File Panduan
                                </p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">
                                    Dokumen Panduan Publik
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Data ini akan tampil pada halaman Panduan/Guide di portal publik PECUT.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50"
                            >
                                <FileUp className="h-4 w-4" /> Upload File
                            </button>
                        </div>

                        <PanduanTable rows={rows} onEdit={openEdit} onDelete={destroy} />
                    </section>

                    <PanduanPagination meta={pagination} />
                </div>

                <PanduanFormModal
                    show={modalOpen}
                    item={editingItem}
                    fileTypes={fileTypes}
                    onClose={closeModal}
                />
            </AdminLayout>
        </>
    );
}
