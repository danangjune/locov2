import React from "react";
import { Link } from "@inertiajs/react";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Building2,
    CheckCircle2,
    GitBranch,
    Layers3,
    Plus,
    RefreshCw,
} from "lucide-react";

import AdminLayout from "../../../Layouts/AdminLayout";
import StatCard from "../../../Components/Admin/StatCard";

function SummaryItem({ label, value, icon: Icon }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-950">
                        {Number(value || 0).toLocaleString("id-ID")}
                    </p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </div>
    );
}

function ProgressBar({ value, max, tone = "sky" }) {
    const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    const colorClass = tone === "emerald" ? "bg-emerald-600" : "bg-sky-600";

    return (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
                className={`h-full rounded-full ${colorClass} transition-all`}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

function ScrollCountPanel({
    label,
    title,
    description,
    items = [],
    max = 0,
    tone = "sky",
    emptyText = "Belum ada data.",
    renderSubtext,
}) {
    return (
        <section className="rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
            <div className="border-b border-slate-100 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                            {label}
                        </p>
                        <h3 className="mt-1 text-xl font-black text-slate-950">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                        {items.length} Data
                    </span>
                </div>
            </div>

            <div className="max-h-[440px] overflow-y-auto p-4 pr-3">
                {items.length ? (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={`${item.id || item.title || item.name}-${index}`}
                                className="rounded-2xl border border-slate-100 p-4 transition hover:border-sky-100 hover:bg-sky-50/40"
                            >
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="line-clamp-2 text-sm font-black text-slate-900">
                                            {item.title || item.name || "-"}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                                            {renderSubtext
                                                ? renderSubtext(item)
                                                : `${Number(item.count || 0).toLocaleString("id-ID")} aplikasi aktif`}
                                        </p>
                                    </div>
                                    <b className="shrink-0 rounded-2xl bg-white px-3 py-2 text-lg font-black text-sky-700 shadow-sm ring-1 ring-slate-100">
                                        {Number(item.count || 0).toLocaleString("id-ID")}
                                    </b>
                                </div>

                                <ProgressBar value={item.count || 0} max={max} tone={tone} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                        {emptyText}
                    </div>
                )}
            </div>
        </section>
    );
}

export default function Index({ meta = {}, data = {} }) {
    const stats = Array.isArray(data?.stats) ? data.stats : [];
    const summary = data?.summary || {};
    const appsByUrusan = Array.isArray(data?.apps_by_urusan)
        ? data.apps_by_urusan
        : [];
    const appsByOpd = Array.isArray(data?.apps_by_opd)
        ? data.apps_by_opd
        : [];
    const appsByCategory = Array.isArray(data?.apps_by_category)
        ? data.apps_by_category
        : [];
    const recentApps = Array.isArray(data?.recent_apps) ? data.recent_apps : [];

    const maxUrusan = Math.max(...appsByUrusan.map((item) => item.count || 0), 0);
    const maxOpd = Math.max(...appsByOpd.map((item) => item.count || 0), 0);

    return (
        <AdminLayout
            title={meta?.title || "Dashboard Admin"}
            subtitle={meta?.description || "Ringkasan pengelolaan Portal PECUT Kota Kediri."}
            actions={
                <Link
                    href="/admin/apps"
                    className="hidden items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-700 sm:inline-flex"
                >
                    <Plus className="h-4 w-4" />
                    Kelola Apps
                </Link>
            }
        >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <StatCard key={item.key || item.title} item={item} />
                ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <SummaryItem label="Total Data Apps" value={summary.total_apps} icon={Layers3} />
                <SummaryItem label="Apps Root" value={summary.root_apps} icon={GitBranch} />
                <SummaryItem label="Apps Child" value={summary.child_apps} icon={Activity} />
                <SummaryItem label="Apps Inactive" value={summary.inactive_apps} icon={RefreshCw} />
                <SummaryItem label="Total OPD" value={summary.total_opd} icon={Building2} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <ScrollCountPanel
                    label="Urusan"
                    title="Jumlah Aplikasi per Urusan"
                    description="Daftar ini dibuat scroll agar seluruh urusan tetap bisa dilihat tanpa membuat halaman terlalu panjang."
                    items={appsByUrusan}
                    max={maxUrusan}
                    emptyText="Belum ada data jumlah aplikasi per urusan."
                    renderSubtext={(item) => `${Number(item.count || 0).toLocaleString("id-ID")} aplikasi aktif`}
                />

                <ScrollCountPanel
                    label="OPD"
                    title="Jumlah Aplikasi per OPD"
                    description="Menghitung aplikasi aktif di bawah item yang memiliki kode urusan Perangkat Daerah. OPD berdiri sendiri dan tidak ikut dihitung ke parent OPD lain."
                    items={appsByOpd}
                    max={maxOpd}
                    tone="emerald"
                    emptyText="Belum ada data jumlah aplikasi per OPD. Pastikan data OPD memakai urusan_id 40."
                    renderSubtext={(item) => {
                        const parent = item.parent_name ? `di bawah ${item.parent_name}` : "Perangkat Daerah";
                        return `${parent} • ${Number(item.count || 0).toLocaleString("id-ID")} aplikasi aktif`;
                    }}
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-slate-200">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                                <BarChart3 className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                                    Kategori
                                </p>
                                <h3 className="mt-1 text-xl font-black text-slate-950">
                                    Distribusi Kategori
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {appsByCategory.length ? (
                                appsByCategory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"
                                    >
                                        <div>
                                            <p className="font-black text-slate-900">{item.title}</p>
                                            <p className="text-xs font-semibold text-slate-400">
                                                {item.subtitle || "Kategori aplikasi"}
                                            </p>
                                        </div>
                                        <span className="rounded-2xl bg-sky-50 px-4 py-2 text-lg font-black text-sky-700">
                                            {Number(item.count || 0).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                                    Belum ada data kategori.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-500 p-6 text-white shadow-xl shadow-sky-100">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-2xl font-black">Dashboard Admin Siap</h3>
                        <p className="mt-2 text-sm leading-6 text-sky-50">
                            Dashboard sudah menampilkan ringkasan aplikasi, jumlah aplikasi per urusan, dan jumlah aplikasi per OPD. Tahap berikutnya modul Apps dapat dimigrasikan menjadi tree table modern.
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-slate-200">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                                Aktivitas Terbaru
                            </p>
                            <h3 className="mt-1 text-xl font-black text-slate-950">
                                Update Aplikasi Terakhir
                            </h3>
                        </div>
                        <Link
                            href="/admin/apps"
                            className="inline-flex items-center gap-2 text-sm font-black text-sky-700 hover:text-sky-900"
                        >
                            Lihat semua
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Aplikasi</th>
                                        <th className="px-5 py-4">Urusan</th>
                                        <th className="px-5 py-4">Kategori</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Update</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {recentApps.length ? (
                                        recentApps.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-4">
                                                    <p className="font-black text-slate-950">{item.name}</p>
                                                    <p className="text-xs font-semibold text-slate-400">
                                                        {item.alias || item.app_from || "-"}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">{item.urusan || "-"}</td>
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                                        {item.category || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-black ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                                                        {item.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-500">{item.updated_at || "-"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-5 py-10 text-center font-semibold text-slate-500">
                                                Belum ada data aplikasi terbaru.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
