import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import {
    Edit3,
    Image as ImageIcon,
    Layers3,
    MonitorPlay,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { alertError, alertSuccess, confirmDelete } from "../../../Utils/swal";
import SearchableSelect from "../../../Components/Form/SearchableSelect";
import SlideFormModal from "./Partials/SlideFormModal";

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

function Pagination({ meta = {}, links = [] }) {
    if (!links?.length || Number(meta?.last_page || 1) <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
            <p className="text-xs font-bold text-slate-400">
                Menampilkan {meta?.from || 0} - {meta?.to || 0} dari {meta?.total || 0} data
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                {links.map((link, index) => (
                    <button
                        key={`${link.label}-${index}`}
                        type="button"
                        disabled={!link.url}
                        onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                        className={[
                            "min-w-10 rounded-xl px-3 py-2 text-xs font-black transition",
                            link.active ? "bg-sky-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                            !link.url ? "cursor-not-allowed opacity-40" : "",
                        ].join(" ")}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}

function EmptyState({ onCreate }) {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
                <MonitorPlay className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-black text-slate-700">Slide beranda belum tersedia</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">
                Tambahkan slide untuk mengatur hero carousel halaman beranda.
            </p>
            <button
                type="button"
                onClick={onCreate}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
            >
                <Plus className="h-4 w-4" /> Tambah Slide
            </button>
        </div>
    );
}

function SlideCard({ slide, onEdit, onDelete }) {
    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
            <div className="relative h-56 bg-slate-100">
                {slide?.image ? (
                    <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="grid h-full place-items-center text-slate-300">
                        <ImageIcon className="h-12 w-12" />
                    </div>
                )}
                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-800 backdrop-blur">
                        Urutan {slide?.sort_order ?? 0}
                    </span>
                    <span
                        className={[
                            "rounded-full px-3 py-1 text-xs font-black backdrop-blur",
                            slide?.statusenabled ? "bg-emerald-500/90 text-white" : "bg-rose-500/90 text-white",
                        ].join(" ")}
                    >
                        {slide?.statusenabled ? "Aktif" : "Nonaktif"}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <p className="line-clamp-1 text-xs font-black uppercase tracking-widest text-sky-600">
                    {slide?.subtitle || "Slide Beranda"}
                </p>
                <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-slate-950">
                    {slide?.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                    {slide?.body}
                </p>

                <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-400">
                    <p className="truncate">Tombol Utama: <span className="font-black text-slate-600">{slide?.button_label || "-"}</span></p>
                    <p className="truncate">URL Utama: <span className="font-black text-slate-600">{slide?.url || "-"}</span></p>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={() => onEdit(slide)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50"
                    >
                        <Edit3 className="h-4 w-4" /> Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(slide)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2 text-xs font-black text-rose-600 hover:bg-rose-100"
                    >
                        <Trash2 className="h-4 w-4" /> Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Index({ meta, filter, data }) {
    const [search, setSearch] = useState(filter?.search || "");
    const [status, setStatus] = useState(filter?.status || "all");
    const [modal, setModal] = useState({ show: false, item: null });

    const stats = data?.stats || {};
    const slides = Array.isArray(data?.slides?.data) ? data.slides.data : [];
    const slideMeta = data?.slides?.meta || {};
    const slideLinks = data?.slides?.links || [];

    const statusOptions = [
        { value: "all", label: "Semua Status" },
        { value: "active", label: "Aktif" },
        { value: "inactive", label: "Nonaktif" },
    ];

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/home-slides",
            { search, status },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const destroySlide = async (slide) => {
        const result = await confirmDelete({
            title: "Hapus Slide Beranda?",
            itemName: slide.title,
            text: "Slide yang dihapus tidak akan tampil lagi pada halaman beranda.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/home-slides/${slide.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: "Slide beranda berhasil dihapus.",
                });
            },
            onError: () => {
                alertError({
                    title: "Gagal Menghapus",
                    text: "Slide beranda gagal dihapus.",
                });
            },
        });
    };

    return (
        <AdminLayout title={meta?.title || "Slide Beranda"}>
            <Head title={meta?.title || "Slide Beranda"} />

            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-600">Manajemen Beranda</p>
                        <h1 className="mt-2 text-3xl font-black text-slate-950">Slide Beranda</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                            Kelola hero carousel halaman beranda, termasuk judul utama, deskripsi, tombol, urutan, dan gambar.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setModal({ show: true, item: null })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Plus className="h-4 w-4" /> Tambah Slide
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard label="Total Slide" value={stats.total} icon={Layers3} />
                    <StatCard label="Slide Aktif" value={stats.active} icon={MonitorPlay} />
                    <StatCard label="Slide Nonaktif" value={stats.inactive} icon={ImageIcon} />
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100">
                    <form onSubmit={submitSearch} className="grid gap-3 lg:grid-cols-[1fr_220px_auto] lg:items-end">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cari Slide</span>
                            <div className="relative mt-2">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul, deskripsi, atau URL..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-sky-300"
                                />
                            </div>
                        </label>

                        <SearchableSelect
                            label="Status"
                            value={status}
                            onChange={setStatus}
                            options={statusOptions}
                            placeholder="Pilih status"
                        />

                        <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800">
                            Terapkan
                        </button>
                    </form>
                </div>

                {slides.length ? (
                    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
                        <div className="grid gap-5 p-5 xl:grid-cols-2">
                            {slides.map((slide) => (
                                <SlideCard
                                    key={slide.id}
                                    slide={slide}
                                    onEdit={(item) => setModal({ show: true, item })}
                                    onDelete={destroySlide}
                                />
                            ))}
                        </div>
                        <Pagination meta={slideMeta} links={slideLinks} />
                    </div>
                ) : (
                    <EmptyState onCreate={() => setModal({ show: true, item: null })} />
                )}
            </div>

            <SlideFormModal
                show={modal.show}
                item={modal.item}
                onClose={() => setModal({ show: false, item: null })}
            />
        </AdminLayout>
    );
}
