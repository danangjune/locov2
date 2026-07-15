import React from "react";
import { Link, router } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronRight,
    ExternalLink,
    GitBranch,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import {
    alertError,
    alertSuccess,
    alertWarning,
    confirmDelete,
} from "../../../../Utils/swal";

function Badge({ children, tone = "slate" }) {
    const tones = {
        slate: "bg-slate-100 text-slate-600",
        sky: "bg-sky-50 text-sky-700",
        emerald: "bg-emerald-50 text-emerald-700",
        rose: "bg-rose-50 text-rose-700",
        violet: "bg-violet-50 text-violet-700",
        amber: "bg-amber-50 text-amber-700",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${tones[tone] || tones.slate}`}
        >
            {children}
        </span>
    );
}

export default function AppTreeRow({
    item,
    depth = 0,
    expanded = {},
    onToggle,
    onMove,
}) {
    const children = Array.isArray(item?.children) ? item.children : [];
    const hasChildren = children.length > 0;
    const isOpen = expanded[item.id] !== false;

    const destroy = async () => {
        if (hasChildren) {
            alertWarning({
                title: "Tidak Bisa Dihapus",
                text: `Aplikasi "${item.name}" masih memiliki child. Hapus atau pindahkan child terlebih dahulu.`,
            });

            return;
        }

        const result = await confirmDelete({
            title: "Hapus Aplikasi?",
            itemName: item.name,
            text: "Tindakan ini tidak bisa dibatalkan.",
        });

        if (!result.isConfirmed) return;

        router.delete(`/admin/apps/${item.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                alertSuccess({
                    title: "Berhasil Dihapus",
                    text: `Aplikasi "${item.name}" berhasil dihapus.`,
                });
            },

            onError: () => {
                alertError({
                    title: "Gagal Menghapus",
                    text: "Terjadi kesalahan saat menghapus aplikasi.",
                });
            },
        });
    };

    return (
        <>
            <tr
                className={`${!item.is_active ? "bg-rose-50/60" : "bg-white"} hover:bg-slate-50`}
            >
                <td className="whitespace-nowrap px-4 py-4 align-top">
                    <div
                        className="flex items-start gap-3"
                        style={{ paddingLeft: depth * 24 }}
                    >
                        <button
                            type="button"
                            onClick={() => hasChildren && onToggle(item.id)}
                            className={`mt-1 grid h-7 w-7 place-items-center rounded-xl border ${
                                hasChildren
                                    ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    : "border-transparent bg-transparent text-slate-300"
                            }`}
                        >
                            {hasChildren ? (
                                isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )
                            ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            )}
                        </button>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-black text-slate-900">
                                    {item.name}
                                </p>
                                {hasChildren && (
                                    <Badge tone="sky">
                                        {children.length} child
                                    </Badge>
                                )}
                                {!item.is_active && (
                                    <Badge tone="rose">Nonaktif</Badge>
                                )}
                                {item.is_sso && (
                                    <Badge tone="emerald">SSO</Badge>
                                )}
                                {item.is_popular && (
                                    <Badge tone="amber">Populer</Badge>
                                )}
                            </div>
                            <div className="mt-1 line-clamp-2 max-w-xl flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
                                <span>#{item.id}</span>
                                {item.code && <span>Code: {item.code}</span>}
                                {item.alias && <span>Alias: {item.alias}</span>}
                            </div>
                            {item.description && (
                                <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-slate-500">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                </td>

                <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                        <Badge tone={item.category_id === 2 ? "violet" : "sky"}>
                            {item.category?.title || "-"}
                        </Badge>
                        <span className="text-xs font-bold text-slate-500">
                            {item.urusan?.title || "-"}
                        </span>
                    </div>
                </td>

                <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                        <Badge
                            tone={item.app_from_id === 2 ? "emerald" : "amber"}
                        >
                            {item.app_from?.name || "-"}
                        </Badge>
                        {item.url ? (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex max-w-[220px] items-center gap-1 truncate text-xs font-black text-sky-600 hover:text-sky-800"
                            >
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{item.url}</span>
                            </a>
                        ) : (
                            <span className="text-xs font-bold text-slate-400">
                                Belum ada URL
                            </span>
                        )}
                    </div>
                </td>

                <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/apps/create?parent=${item.id}`}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Tambah child"
                        >
                            <Plus className="h-4 w-4" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => onMove(item)}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100"
                            title="Pindah parent"
                        >
                            <GitBranch className="h-4 w-4" />
                        </button>
                        <Link
                            href={`/admin/apps/${item.id}/edit`}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                            type="button"
                            onClick={destroy}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                            title="Hapus"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {hasChildren &&
                isOpen &&
                children.map((child) => (
                    <AppTreeRow
                        key={child.id}
                        item={child}
                        depth={depth + 1}
                        expanded={expanded}
                        onToggle={onToggle}
                        onMove={onMove}
                    />
                ))}
        </>
    );
}
