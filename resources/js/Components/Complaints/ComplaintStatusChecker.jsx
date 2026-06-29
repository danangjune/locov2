import React, { useMemo, useState } from "react";
import {
    AlertCircle,
    Building2,
    CheckCircle2,
    Clock3,
    ExternalLink,
    Image as ImageIcon,
    Loader2,
    MapPin,
    MessageSquareText,
    Search,
    Ticket,
    UserRound,
} from "lucide-react";

function csrfToken() {
    return document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
}

function cleanTicket(value = "") {
    return String(value || "")
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "")
        .slice(0, 30);
}

function isImage(path = "") {
    return /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(path);
}

function statusClass(theme = "primary") {
    const map = {
        success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        warning: "bg-amber-50 text-amber-700 ring-amber-100",
        danger: "bg-rose-50 text-rose-700 ring-rose-100",
        info: "bg-cyan-50 text-cyan-700 ring-cyan-100",
        primary: "theme-bg-primary-soft theme-text-primary theme-border-primary-soft",
    };

    return map[theme] || map.primary;
}

function InfoPill({ icon, label, value, href }) {
    if (!value) return null;

    const content = (
        <div className="group flex min-w-0 items-center gap-3 rounded-2xl border theme-border-primary-soft theme-bg-surface px-3 py-2.5 text-sm font-semibold theme-muted transition hover:theme-bg-primary-soft">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl theme-bg-primary-soft theme-text-primary">
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-black uppercase tracking-widest theme-muted">
                    {label}
                </span>
                <span className="block truncate theme-text">{value}</span>
            </span>
            {href ? (
                <ExternalLink className="h-3.5 w-3.5 shrink-0 theme-muted transition group-hover:theme-text-primary" />
            ) : null}
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer">
                {content}
            </a>
        );
    }

    return content;
}

function EmptyBox({ children }) {
    return (
        <div className="rounded-[1.5rem] border border-dashed theme-border-primary-soft theme-bg-surface p-5 text-sm font-semibold theme-muted">
            {children}
        </div>
    );
}

function StatusSummary({ complaint }) {
    const status = complaint?.current_status || {};
    const skpd = Array.isArray(complaint?.skpd) ? complaint.skpd.join(", ") : "";

    return (
        <div className="theme-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full theme-bg-primary px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-200">
                            <Ticket className="h-3.5 w-3.5" />
                            {complaint.ticket || "-"}
                        </span>
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-widest ring-1 ${statusClass(status.theme)}`}
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {status.name || "Status belum tersedia"}
                        </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black tracking-tight theme-text sm:text-3xl">
                        {complaint.topic || "Aduan Masyarakat"}
                        {complaint.sub_topic ? (
                            <span className="theme-muted"> · {complaint.sub_topic}</span>
                        ) : null}
                    </h3>

                    {complaint.latest_update?.message ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 theme-muted">
                            {complaint.latest_update.message}
                        </p>
                    ) : null}
                </div>

                <div className="shrink-0 rounded-2xl theme-bg-primary-soft px-4 py-3 ring-1 theme-ring-primary-soft theme-border-primary-soft lg:text-right">
                    <p className="text-xs font-black uppercase tracking-widest theme-text-primary">
                        Terakhir diperbarui
                    </p>
                    <p className="mt-1 text-sm font-black theme-text">
                        {status.created_at_human || status.created_at || "-"}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoPill
                    icon={<Building2 className="h-4 w-4" />}
                    label="OPD Penanganan"
                    value={skpd}
                />
                <InfoPill
                    icon={<MapPin className="h-4 w-4" />}
                    label="Lokasi"
                    value={complaint.location || complaint.address}
                    href={complaint.map_url}
                />
                <InfoPill
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Respon Time"
                    value={complaint.response_time}
                />
                <InfoPill
                    icon={<UserRound className="h-4 w-4" />}
                    label="Kanal"
                    value={complaint.channel || complaint.type}
                />
            </div>
        </div>
    );
}

function HistoryTimeline({ histories = [] }) {
    if (!histories.length) {
        return <EmptyBox>Riwayat status belum tersedia.</EmptyBox>;
    }

    return (
        <div className="theme-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest theme-text-primary">
                        Riwayat Status
                    </p>
                    <h4 className="mt-1 text-lg font-black theme-text">
                        Perkembangan Aduan
                    </h4>
                </div>
                <span className="rounded-full theme-bg-primary-soft px-3 py-1 text-xs font-black theme-text-primary">
                    {histories.length} tahap
                </span>
            </div>

            <div className="mt-5 space-y-4">
                {histories.map((item, index) => {
                    const last = index === histories.length - 1;

                    return (
                        <div key={item.id || index} className="relative flex gap-3">
                            <div className="flex flex-col items-center">
                                <span
                                    className={`grid h-9 w-9 place-items-center rounded-full ring-1 theme-ring-primary-soft ${statusClass(item.status_theme)}`}
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                </span>
                                {!last ? (
                                    <span className="my-1 h-full min-h-8 w-px bg-slate-200" />
                                ) : null}
                            </div>

                            <div className="min-w-0 flex-1 pb-2">
                                <div className="rounded-2xl theme-bg-page px-4 py-3">
                                    <p className="text-sm font-black theme-text">
                                        {item.status_name}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold theme-muted">
                                        {item.created_at_human || item.created_at || "-"}
                                        {item.user_name ? ` · ${item.user_name}` : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DetailMessages({ details = [] }) {
    if (!details.length) {
        return <EmptyBox>Detail percakapan belum tersedia.</EmptyBox>;
    }

    return (
        <div className="theme-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest theme-text-primary">
                        Detail Aduan
                    </p>
                    <h4 className="mt-1 text-lg font-black theme-text">
                        Pesan dan Tindak Lanjut
                    </h4>
                </div>
                <MessageSquareText className="h-5 w-5 theme-text-primary" />
            </div>

            <div className="mt-5 max-h-[460px] space-y-4 overflow-y-auto pr-2 scrollbar-thumb-slate-200">
                {details.map((item, index) => {
                    const isCitizen = item.role === "warga";

                    return (
                        <div
                            key={item.id || index}
                            className={`rounded-3xl p-4 ${
                                isCitizen ? "theme-bg-primary-soft" : "theme-bg-page"
                            }`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-black theme-text">
                                    {item.name}
                                    {item.role ? (
                                        <span className="ml-2 rounded-full theme-bg-surface px-2 py-0.5 text-[10px] font-black uppercase tracking-widest theme-muted ring-1 theme-ring-primary-soft theme-border-primary-soft">
                                            {item.role}
                                        </span>
                                    ) : null}
                                </p>
                                <p className="text-xs font-semibold theme-muted">
                                    {item.created_at_human || item.created_at || "-"}
                                </p>
                            </div>

                            <p className="mt-3 text-sm leading-7 theme-muted">
                                {item.message}
                            </p>

                            {item.attachments?.length ? (
                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {item.attachments.map((file) => (
                                        <a
                                            key={file.id || file.path}
                                            href={file.path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group overflow-hidden rounded-2xl border theme-border-primary-soft theme-bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            {isImage(file.path) ? (
                                                <img
                                                    src={file.path}
                                                    alt={file.name}
                                                    className="h-24 w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="grid h-24 place-items-center theme-bg-page theme-muted">
                                                    <ImageIcon className="h-7 w-7" />
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold theme-muted">
                                                <span className="truncate">{file.name}</span>
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0 theme-muted" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ComplaintResult({ complaint }) {
    return (
        <div className="mt-6 space-y-5">
            <StatusSummary complaint={complaint} />

            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <HistoryTimeline histories={complaint.histories} />
                <DetailMessages details={complaint.details} />
            </div>
        </div>
    );
}

export default function ComplaintStatusChecker({
    title = "Cek Status Aduan",
    subtitle = "Masukkan nomor tiket Lapor Mbak Wali untuk memantau perkembangan laporan Anda.",
    defaultTicket = "",
    compact = false,
}) {
    const [ticket, setTicket] = useState(cleanTicket(defaultTicket));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [complaint, setComplaint] = useState(null);

    const hasResult = Boolean(complaint);

    const exampleText = useMemo(() => {
        return ticket ? `Nomor tiket: ${ticket}` : "Contoh: XYZ65";
    }, [ticket]);

    const submit = async (event) => {
        event.preventDefault();

        const cleaned = cleanTicket(ticket);
        setTicket(cleaned);
        setError("");
        setComplaint(null);

        if (!cleaned) {
            setError("Nomor tiket wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/complaints/status-check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken() || "",
                },
                body: JSON.stringify({ ticket: cleaned }),
            });

            const payload = await response.json();

            if (!response.ok || !payload?.ok) {
                setError(payload?.message || "Status aduan tidak ditemukan.");
                return;
            }

            setComplaint(payload.data);
        } catch (err) {
            setError("Tidak dapat menghubungi layanan cek status. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={compact ? "" : "py-4 mt-4 mb-2"}>
            <div className="theme-card rounded-[2rem] p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full theme-bg-primary-soft px-3 py-1.5 text-xs font-black uppercase tracking-widest theme-text-primary ring-1 theme-ring-primary-soft theme-border-primary-soft">
                            <Ticket className="h-3.5 w-3.5" />
                            Ticket
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight theme-text sm:text-3xl">
                            {title}
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 theme-muted">
                            {subtitle}
                        </p>
                    </div>

                    <form onSubmit={submit} className="rounded-[1.75rem] theme-bg-page p-3 ring-1 theme-ring-primary-soft theme-border-primary-soft">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Ticket className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 theme-muted" />
                                <input
                                    value={ticket}
                                    onChange={(event) => setTicket(cleanTicket(event.target.value))}
                                    placeholder="Masukkan nomor tiket"
                                    className="theme-focus h-14 w-full rounded-2xl border theme-border-primary-soft theme-bg-surface pl-12 pr-4 text-sm font-black uppercase tracking-widest theme-text shadow-sm transition placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-theme-primary h-14 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Search className="h-5 w-5" />
                                )}
                                Cek Status
                            </button>
                        </div>

                        <p className="mt-3 px-1 text-xs font-semibold theme-muted">
                            {exampleText}
                        </p>
                    </form>
                </div>

                {error ? (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                ) : null}

                {hasResult ? <ComplaintResult complaint={complaint} /> : null}
            </div>
        </section>
    );
}
