import React from "react";
import {
    Download,
    Edit3,
    ExternalLink,
    FileArchive,
    FileImage,
    FileQuestion,
    FileSpreadsheet,
    FileText,
    Presentation,
    Trash2,
} from "lucide-react";

const typeMeta = {
    pdf: { label: "PDF", icon: FileText, className: "bg-rose-50 text-rose-700 ring-rose-100" },
    doc: { label: "DOC", icon: FileArchive, className: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
    docx: { label: "DOCX", icon: FileArchive, className: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
    ppt: { label: "PPT", icon: Presentation, className: "bg-amber-50 text-amber-700 ring-amber-100" },
    pptx: { label: "PPTX", icon: Presentation, className: "bg-amber-50 text-amber-700 ring-amber-100" },
    xls: { label: "XLS", icon: FileSpreadsheet, className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    xlsx: { label: "XLSX", icon: FileSpreadsheet, className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    csv: { label: "CSV", icon: FileSpreadsheet, className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    jpg: { label: "JPG", icon: FileImage, className: "bg-violet-50 text-violet-700 ring-violet-100" },
    jpeg: { label: "JPEG", icon: FileImage, className: "bg-violet-50 text-violet-700 ring-violet-100" },
    png: { label: "PNG", icon: FileImage, className: "bg-violet-50 text-violet-700 ring-violet-100" },
    webp: { label: "WEBP", icon: FileImage, className: "bg-violet-50 text-violet-700 ring-violet-100" },
};

function TypeBadge({ type }) {
    const meta = typeMeta[String(type || "").toLowerCase()] || {
        label: type || "FILE",
        icon: FileQuestion,
        className: "bg-slate-100 text-slate-600 ring-slate-200",
    };
    const Icon = meta.icon;

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${meta.className}`}>
            <Icon className="h-3.5 w-3.5" /> {meta.label}
        </span>
    );
}

export default function PanduanTable({ rows = [], onEdit, onDelete }) {
    if (!rows.length) {
        return (
            <div className="p-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400">
                    <FileQuestion className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Belum ada file panduan</h3>
                <p className="mt-2 text-sm text-slate-500">Tambahkan dokumen panduan agar tampil pada halaman publik.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                    <tr>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">File</th>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi</th>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Tipe</th>
                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Path</th>
                        <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                            <td className="px-5 py-4 align-top">
                                <div className="flex items-start gap-3">
                                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-[220px]">
                                        <p className="font-black text-slate-900">{item.name_file}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-400">ID #{item.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="max-w-[360px] px-5 py-4 align-top">
                                <p className="line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
                            </td>
                            <td className="px-5 py-4 align-top">
                                <TypeBadge type={item.typefile} />
                            </td>
                            <td className="max-w-[260px] px-5 py-4 align-top">
                                <p className="truncate text-xs font-semibold text-slate-400" title={item.asset_file}>
                                    {item.asset_file || "-"}
                                </p>
                                {item.file_url && item.file_url !== "#" ? (
                                    <a
                                        href={item.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 hover:bg-sky-100 hover:text-sky-700"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" /> Lihat File
                                    </a>
                                ) : null}
                            </td>
                            <td className="px-5 py-4 align-top">
                                <div className="flex justify-end gap-2">
                                    {item.file_url && item.file_url !== "#" ? (
                                        <a
                                            href={item.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100"
                                            title="Download / lihat file"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.(item)}
                                        className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100"
                                        title="Edit"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(item)}
                                        className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
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
    );
}
