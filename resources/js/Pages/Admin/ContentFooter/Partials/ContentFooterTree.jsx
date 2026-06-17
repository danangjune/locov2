import React from "react";
import { ChevronDown, ChevronRight, Edit3, ExternalLink, Image as ImageIcon, Link2, Plus, Trash2 } from "lucide-react";

function Badge({ children, tone = "slate" }) {
    const tones = {
        slate: "bg-slate-100 text-slate-600",
        sky: "bg-sky-100 text-sky-700",
        emerald: "bg-emerald-100 text-emerald-700",
        violet: "bg-violet-100 text-violet-700",
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${tones[tone] || tones.slate}`}>
            {children}
        </span>
    );
}

function ContentRow({ item, level = 0, expanded, onToggle, onCreateChild, onEdit, onDelete }) {
    const children = Array.isArray(item.children) ? item.children : [];
    const hasChildren = children.length > 0;
    const isOpen = expanded[item.id] !== false;
    const isGroup = item.type === "group" || Number(item.parent || 0) === 0;

    return (
        <>
            <tr className={isGroup ? "bg-white" : "bg-slate-50/50"}>
                <td className="px-5 py-4 align-top">
                    <div className="flex items-start gap-3" style={{ paddingLeft: `${level * 24}px` }}>
                        <button
                            type="button"
                            onClick={() => hasChildren && onToggle(item.id)}
                            className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${hasChildren ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50" : "border-transparent bg-transparent text-transparent"}`}
                            disabled={!hasChildren}
                        >
                            {hasChildren ? (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : <ChevronRight className="h-4 w-4" />}
                        </button>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-black text-slate-950">{item.content || "-"}</p>
                                <Badge tone={isGroup ? "sky" : "emerald"}>{isGroup ? "Group" : "Content"}</Badge>
                                {item.idx_content !== null && item.idx_content !== undefined && (
                                    <Badge>Urutan {item.idx_content}</Badge>
                                )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                <span>ID: {item.id}</span>
                                {item.icon && <span>Icon: {item.icon}</span>}
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-700 hover:underline">
                                        <ExternalLink className="h-3 w-3" /> Buka URL
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </td>

                <td className="px-5 py-4 align-top">
                    <div className="max-w-xs truncate text-sm font-semibold text-slate-600" title={item.url || ""}>
                        {item.url ? (
                            <span className="inline-flex items-center gap-2">
                                <Link2 className="h-4 w-4 text-sky-500" /> {item.url}
                            </span>
                        ) : (
                            <span className="text-slate-400">Tidak ada URL</span>
                        )}
                    </div>
                </td>

                <td className="px-5 py-4 align-top">
                    {item.image ? (
                        <a href={item.image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2 hover:border-sky-200">
                            <img src={item.image} alt={item.content || "Footer image"} className="h-12 w-16 rounded-xl object-cover" />
                            <span className="text-xs font-black text-sky-700">Preview</span>
                        </a>
                    ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
                            <ImageIcon className="h-4 w-4" /> Tidak ada gambar
                        </span>
                    )}
                </td>

                <td className="px-5 py-4 align-top text-right">
                    <div className="inline-flex flex-wrap justify-end gap-2">
                        {isGroup && (
                            <button
                                type="button"
                                onClick={() => onCreateChild(item)}
                                className="rounded-xl bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100"
                                title="Tambah child"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="rounded-xl bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                            title="Edit"
                        >
                            <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="rounded-xl bg-rose-50 p-2 text-rose-700 hover:bg-rose-100"
                            title="Hapus"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {hasChildren && isOpen && children.map((child) => (
                <ContentRow
                    key={child.id}
                    item={child}
                    level={level + 1}
                    expanded={expanded}
                    onToggle={onToggle}
                    onCreateChild={onCreateChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
}

export default function ContentFooterTree({ rows = [], expanded = {}, onToggle, onCreateChild, onEdit, onDelete }) {
    if (!rows.length) {
        return (
            <div className="px-6 py-16 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <Link2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Content footer tidak ditemukan</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Coba ubah filter pencarian atau tambahkan group baru.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Content</th>
                        <th className="w-80 px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">URL</th>
                        <th className="w-56 px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Gambar</th>
                        <th className="w-44 px-5 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((item) => (
                        <ContentRow
                            key={item.id}
                            item={item}
                            expanded={expanded}
                            onToggle={onToggle}
                            onCreateChild={onCreateChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
