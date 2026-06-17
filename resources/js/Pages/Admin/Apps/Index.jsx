import React, { useMemo, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { AlertCircle, AppWindow, CheckCircle2, ExternalLink, GitBranch, Layers3, Plus, ShieldCheck } from "lucide-react";

import AdminLayout from "../../../Layouts/AdminLayout";
import AppFilter from "./Partials/AppFilter";
import AppPagination from "./Partials/AppPagination";
import AppTreeRow from "./Partials/AppTreeRow";
import MoveParentModal from "./Partials/MoveParentModal";

function MiniStat({ title, value, icon: Icon, tone = "sky" }) {
    const tones = {
        sky: "bg-sky-50 text-sky-700 ring-sky-100",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        rose: "bg-rose-50 text-rose-700 ring-rose-100",
        violet: "bg-violet-50 text-violet-700 ring-violet-100",
        amber: "bg-amber-50 text-amber-700 ring-amber-100",
    };

    return (
        <div className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-black text-slate-950">{Number(value || 0).toLocaleString("id-ID")}</p>
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

    const walk = (rows) => {
        rows.forEach((item) => {
            const children = Array.isArray(item.children) ? item.children : [];

            if (children.length > 0) {
                ids[item.id] = value;
                walk(children);
            }
        });
    };

    walk(items);

    return ids;
}

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const { props } = usePage();
    const flash = props?.flash || {};
    const errors = props?.errors || {};

    const apps = Array.isArray(data?.apps?.items) ? data.apps.items : [];
    const stats = data?.stats || {};
    const options = data?.options || {};
    const parentOptions = data?.parent_options || [];
    const pagination = data?.apps?.meta || {};

    const [expanded, setExpanded] = useState(() => collectIds(apps));
    const [movingApp, setMovingApp] = useState(null);

    const allExpanded = useMemo(() => {
        const ids = Object.keys(collectIds(apps));
        return ids.length > 0 && ids.every((id) => expanded[id] !== false);
    }, [apps, expanded]);

    const toggle = (id) => {
        setExpanded((current) => ({
            ...current,
            [id]: current[id] === false,
        }));
    };

    const toggleAll = () => {
        if (allExpanded) {
            setExpanded(collectIds(apps, false));
            return;
        }

        setExpanded(collectIds(apps, true));
    };

    return (
        <>
            <Head title={meta?.title || "Manajemen Aplikasi"} />

            <AdminLayout
                title={meta?.title || "Manajemen Aplikasi"}
                subtitle={meta?.subtitle || "Kelola struktur aplikasi PECUT."}
                actions={(
                    <Link
                        href="/admin/apps/create"
                        className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        <Plus className="h-4 w-4" /> Tambah Aplikasi
                    </Link>
                )}
            >
                <div className="space-y-6">
                    {(flash?.success || errors?.delete || errors?.parent) && (
                        <div className={`rounded-3xl border p-4 ${flash?.success ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-rose-100 bg-rose-50 text-rose-800"}`}>
                            <div className="flex items-start gap-3">
                                {flash?.success ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
                                <p className="text-sm font-bold">{flash?.success || errors?.delete || errors?.parent}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MiniStat title="Total Apps" value={stats.total} icon={AppWindow} tone="sky" />
                        <MiniStat title="Root Apps" value={stats.root_total} icon={GitBranch} tone="violet" />
                        <MiniStat title="Aktif" value={stats.active_total} icon={CheckCircle2} tone="emerald" />
                        <MiniStat title="SSO" value={stats.sso_total} icon={ShieldCheck} tone="amber" />
                    </div>

                    <AppFilter filter={filter} options={options} />

                    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-sky-600">Tree Table</p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">Struktur APP Links</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Parent tetap ditampilkan ketika child cocok dengan filter agar konteks struktur tidak hilang.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={toggleAll}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50"
                                >
                                    <Layers3 className="h-4 w-4" /> {allExpanded ? "Collapse Semua" : "Expand Semua"}
                                </button>
                                <a
                                    href="/apps"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50"
                                >
                                    <ExternalLink className="h-4 w-4" /> Lihat Portal
                                </a>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Aplikasi</th>
                                        <th className="w-64 px-4 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Kategori / Urusan</th>
                                        <th className="w-72 px-4 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Sumber / URL</th>
                                        <th className="w-48 px-4 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {apps.length ? (
                                        apps.map((item) => (
                                            <AppTreeRow
                                                key={item.id}
                                                item={item}
                                                expanded={expanded}
                                                onToggle={toggle}
                                                onMove={setMovingApp}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-16 text-center">
                                                <div className="mx-auto max-w-md">
                                                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                                                        <AppWindow className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="mt-4 text-lg font-black text-slate-900">Data aplikasi tidak ditemukan</h3>
                                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                                        Coba ubah filter pencarian atau tambahkan aplikasi baru.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <AppPagination meta={pagination} filter={filter} />
                </div>

                <MoveParentModal
                    app={movingApp}
                    parentOptions={parentOptions}
                    onClose={() => setMovingApp(null)}
                />
            </AdminLayout>
        </>
    );
}
