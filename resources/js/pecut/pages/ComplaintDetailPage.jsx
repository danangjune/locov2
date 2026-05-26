import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleDot,
    Clock3,
    ExternalLink,
    FileText,
    Globe2,
    ImageIcon,
    Link as LinkIcon,
    MapPin,
    MessageSquareText,
    ShieldCheck,
    Ticket,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";
import { fetchComplaintDetailFromApi } from "../api/complaintsApi";
import { classNames } from "../utils/helpers";

function parseDateValue(value) {
    if (!value) return null;

    const normalized = String(value).replace(" ", "T");
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
}

function formatRunningDuration(from) {
    const startDate = parseDateValue(from);

    if (!startDate) return "-";

    const now = new Date();
    const diffSeconds = Math.max(0, Math.floor((now - startDate) / 1000));

    const days = Math.floor(diffSeconds / 86400);
    const hours = Math.floor((diffSeconds % 86400) / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    if (days > 0) return `${days} hari ${hours} jam`;
    if (hours > 0) return `${hours} jam ${minutes} menit`;
    if (minutes > 0) return `${minutes} menit ${seconds} detik`;

    return `${seconds} detik`;
}

function isFinishedStatus(status = "") {
    const text = String(status).toLowerCase();

    return (
        text.includes("selesai") ||
        text.includes("diselesaikan") ||
        text.includes("ditutup")
    );
}

function getStatusStyle(status = "") {
    const text = String(status).toLowerCase();

    if (isFinishedStatus(text)) {
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    }

    if (text.includes("diproses")) {
        return "bg-sky-50 text-sky-700 ring-sky-100";
    }

    if (text.includes("belum")) {
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }

    if (text.includes("diterima")) {
        return "bg-violet-50 text-violet-700 ring-violet-100";
    }

    return "bg-slate-50 text-slate-700 ring-slate-100";
}

function getTimelineMeta(status = "", isCurrent = false) {
    const text = String(status).toLowerCase();

    if (
        text.includes("selesai") ||
        text.includes("diselesaikan") ||
        text.includes("ditutup")
    ) {
        return {
            dot: isCurrent
                ? "bg-emerald-600 text-white ring-emerald-100"
                : "bg-emerald-50 text-emerald-700 ring-emerald-100",
            line: "bg-emerald-100",
            card: "bg-emerald-50/60 border-emerald-100",
            badge: "bg-emerald-100 text-emerald-700",
            Icon: CheckCircle2,
        };
    }

    if (text.includes("diproses")) {
        return {
            dot: isCurrent
                ? "bg-sky-600 text-white ring-sky-100"
                : "bg-sky-50 text-sky-700 ring-sky-100",
            line: "bg-sky-100",
            card: "bg-sky-50/60 border-sky-100",
            badge: "bg-sky-100 text-sky-700",
            Icon: Clock3,
        };
    }

    if (text.includes("belum")) {
        return {
            dot: isCurrent
                ? "bg-amber-500 text-white ring-amber-100"
                : "bg-amber-50 text-amber-700 ring-amber-100",
            line: "bg-amber-100",
            card: "bg-amber-50/60 border-amber-100",
            badge: "bg-amber-100 text-amber-700",
            Icon: Clock3,
        };
    }

    if (text.includes("diterima")) {
        return {
            dot: isCurrent
                ? "bg-violet-600 text-white ring-violet-100"
                : "bg-violet-50 text-violet-700 ring-violet-100",
            line: "bg-violet-100",
            card: "bg-violet-50/60 border-violet-100",
            badge: "bg-violet-100 text-violet-700",
            Icon: CheckCircle2,
        };
    }

    if (
        text.includes("pelapor") ||
        text.includes("membuat aduan") ||
        text.includes("melaporkan")
    ) {
        return {
            dot: isCurrent
                ? "bg-rose-600 text-white ring-rose-100"
                : "bg-rose-50 text-rose-700 ring-rose-100",
            line: "bg-rose-100",
            card: "bg-rose-50/60 border-rose-100",
            badge: "bg-rose-100 text-rose-700",
            Icon: CircleDot,
        };
    }

    return {
        dot: isCurrent
            ? "bg-slate-700 text-white ring-slate-100"
            : "bg-slate-50 text-slate-700 ring-slate-100",
        line: "bg-slate-100",
        card: "bg-slate-50 border-slate-100",
        badge: "bg-slate-100 text-slate-700",
        Icon: CircleDot,
    };
}

function RunningDuration({ from, hidden = false }) {
    const [duration, setDuration] = useState(() =>
        hidden ? "" : formatRunningDuration(from),
    );

    useEffect(() => {
        if (hidden || !from) {
            setDuration("");
            return undefined;
        }

        const update = () => {
            setDuration(formatRunningDuration(from));
        };

        update();

        const timer = window.setInterval(update, 1000);

        return () => window.clearInterval(timer);
    }, [from, hidden]);

    if (hidden || !duration) return null;

    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 ring-1 ring-rose-100">
            <Clock3 className="h-4 w-4" />
            {duration}
        </span>
    );
}

function InfoBox({ icon: Icon, label, value }) {
    return (
        <div className="rounded-3xl bg-slate-50 p-5">
            <Icon className="h-6 w-6 text-sky-700" />

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-black leading-6 text-slate-900">
                {value || "-"}
            </p>
        </div>
    );
}

export default function ComplaintDetailPage({
    slug,
    navigate,
    complaints = [],
}) {
    const initialComplaint = useMemo(() => {
        return complaints.find((item) => String(item.slug) === String(slug));
    }, [complaints, slug]);

    const [complaint, setComplaint] = useState(initialComplaint || null);
    const [loading, setLoading] = useState(!initialComplaint);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadDetail() {
            try {
                setLoading(true);
                setError("");

                const result = await fetchComplaintDetailFromApi(slug);

                if (!isMounted) return;

                setComplaint(result);
            } catch (err) {
                if (!isMounted) return;

                console.error("PECUT detail aduan error:", err);
                setError(err.message || "Gagal memuat detail aduan.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadDetail();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    if (loading) {
        return (
            <PageShell>
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-slate-100" />
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
                        <div className="h-96 animate-pulse rounded-[2rem] bg-slate-100" />
                        <div className="h-96 animate-pulse rounded-[2rem] bg-slate-100" />
                    </div>
                </section>
            </PageShell>
        );
    }

    if (error || !complaint) {
        return (
            <PageShell>
                <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-black text-slate-900">
                        Detail aduan tidak ditemukan
                    </h1>

                    <p className="mt-3 text-slate-500">
                        {error || "Data aduan belum tersedia."}
                    </p>

                    <button
                        onClick={() => navigate("home")}
                        className="mt-6 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                    >
                        Kembali ke Beranda
                    </button>
                </section>
            </PageShell>
        );
    }

    const images = Array.isArray(complaint.images) ? complaint.images : [];
    const history = Array.isArray(complaint.history) ? complaint.history : [];
    const skpd = Array.isArray(complaint.skpd) ? complaint.skpd : [];
    const latestStatus = complaint.lastStatus || "-";
    const finished = complaint.isFinished || isFinishedStatus(latestStatus);
    const statusClassName = getStatusStyle(latestStatus);

    return (
        <PageShell>
            <PageHero
                eyebrow="Detail Aduan Warga"
                title={`Tiket #${complaint.noTicket}`}
                subtitle={complaint.summary || complaint.description}
                icon={MessageSquareText}
                gradient="from-sky-600 to-blue-700"
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("home")}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-black text-sky-700 hover:bg-sky-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke beranda
                </button>

                <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
                    <main className="space-y-6">
                        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
                            <div className="relative h-[340px] bg-slate-100">
                                {images[0] ? (
                                    <img
                                        src={images[0]}
                                        alt={complaint.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-500">
                                        <ImageIcon className="h-14 w-14" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                                    <span
                                        className={classNames(
                                            "inline-flex items-center rounded-full px-4 py-2 text-sm font-black ring-1 backdrop-blur",
                                            statusClassName,
                                        )}
                                    >
                                        {latestStatus}
                                    </span>

                                    <RunningDuration
                                        from={complaint.lastStatusAt}
                                        hidden={finished}
                                    />
                                </div>

                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
                                        {complaint.title}
                                    </p>

                                    <h1 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                                        {complaint.location}
                                    </h1>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <InfoBox
                                        icon={Ticket}
                                        label="Nomor Tiket"
                                        value={`#${complaint.noTicket}`}
                                    />
                                    <InfoBox
                                        icon={CalendarDays}
                                        label="Tanggal Masuk"
                                        value={complaint.createdAtLabel}
                                    />
                                    <InfoBox
                                        icon={Globe2}
                                        label="Kanal"
                                        value={complaint.channel?.nama || "-"}
                                    />
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-2xl font-black text-slate-900">
                                        Isi Aduan
                                    </h2>

                                    <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">
                                        {complaint.description}
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 md:grid-cols-2">
                                    <InfoBox
                                        icon={MapPin}
                                        label="Lokasi"
                                        value={complaint.location}
                                    />
                                    <InfoBox
                                        icon={ShieldCheck}
                                        label="Jenis Aduan"
                                        value={complaint.type}
                                    />
                                </div>

                                {skpd.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-2xl font-black text-slate-900">
                                            OPD / SKPD Tujuan
                                        </h2>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {skpd.map((item) => (
                                                <span
                                                    key={item}
                                                    className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-700 ring-1 ring-sky-100"
                                                >
                                                    <Building2 className="h-4 w-4" />
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                        Bukti Aduan
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                                        Galeri Dokumentasi
                                    </h2>
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                    {images.length} File
                                </span>
                            </div>

                            {images.length > 0 ? (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {images.map((image, index) => (
                                        <a
                                            key={`${image}-${index}`}
                                            href={image}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group relative h-48 overflow-hidden rounded-3xl bg-slate-100"
                                        >
                                            <img
                                                src={image}
                                                alt={`Bukti ${index + 1}`}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                                            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-700 shadow">
                                                Bukti {index + 1}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-3xl border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
                                    <ImageIcon className="mx-auto h-10 w-10 text-sky-400" />
                                    <p className="mt-3 text-sm font-bold text-slate-600">
                                        Tidak ada bukti gambar pada aduan ini.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                    Timeline
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-slate-900">
                                    Riwayat Proses Aduan
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Alur penanganan aduan ditampilkan berurutan
                                    dari laporan awal hingga status terakhir.
                                </p>
                            </div>

                            {history.length > 0 ? (
                                <div className="mt-6 space-y-5">
                                    {history.map((item, index) => {
                                        const isLast =
                                            index === history.length - 1;
                                        const meta = getTimelineMeta(
                                            item.status,
                                            isLast,
                                        );
                                        const Icon = meta.Icon;

                                        return (
                                            <div
                                                key={`${item.status}-${item.created_at}-${index}`}
                                                className="grid gap-4 sm:grid-cols-[36px_1fr]"
                                            >
                                                <div className="relative flex justify-center">
                                                    <div
                                                        className={classNames(
                                                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full ring-4",
                                                            meta.dot,
                                                        )}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    {!isLast && (
                                                        <div
                                                            className={classNames(
                                                                "absolute top-10 h-full w-[2px]",
                                                                meta.line,
                                                            )}
                                                        />
                                                    )}
                                                </div>

                                                <div
                                                    className={classNames(
                                                        "rounded-3xl border p-5 transition",
                                                        meta.card,
                                                    )}
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-black text-slate-900">
                                                                {item.status}
                                                            </h3>

                                                            <p className="mt-2 text-sm font-semibold text-slate-500">
                                                                {item.created_at_label ||
                                                                    item.created_at}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {isLast && (
                                                                <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-black text-white">
                                                                    Status
                                                                    Terbaru
                                                                </span>
                                                            )}

                                                            <span
                                                                className={classNames(
                                                                    "rounded-full px-3 py-1 text-xs font-black",
                                                                    meta.badge,
                                                                )}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-3xl border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
                                    <p className="text-sm font-bold text-slate-600">
                                        Riwayat proses belum tersedia.
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                Ringkasan
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-slate-900">
                                Informasi Aduan
                            </h2>

                            <div className="mt-6 space-y-3">
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Status Terakhir
                                    </p>

                                    <span
                                        className={classNames(
                                            "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ring-1",
                                            statusClassName,
                                        )}
                                    >
                                        {latestStatus}
                                    </span>
                                </div>

                                {!finished && (
                                    <div className="rounded-3xl bg-rose-50 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-rose-400">
                                            Berjalan Sejak Update Terakhir
                                        </p>

                                        <div className="mt-2">
                                            <RunningDuration
                                                from={complaint.lastStatusAt}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Update Terakhir
                                    </p>

                                    <p className="mt-2 text-sm font-black text-slate-900">
                                        {complaint.lastStatusAtLabel || "-"}
                                    </p>
                                </div>

                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Total Data
                                    </p>

                                    <p className="mt-2 text-sm font-black text-slate-900">
                                        {complaint.totalHistory} riwayat proses
                                        • {complaint.totalImages} bukti
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                Peta Lokasi
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-slate-900">
                                Titik Aduan
                            </h2>

                            {complaint.mapEmbed ? (
                                <iframe
                                    title="Peta lokasi aduan"
                                    src={complaint.mapEmbed}
                                    className="mt-5 h-64 w-full rounded-3xl border-0"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="mt-5 rounded-3xl border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
                                    <MapPin className="mx-auto h-10 w-10 text-sky-400" />
                                    <p className="mt-3 text-sm font-bold text-slate-600">
                                        Peta belum tersedia.
                                    </p>
                                </div>
                            )}

                            {complaint.maps && (
                                <a
                                    href={complaint.maps}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                >
                                    Buka Google Maps
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                Metadata
                            </p>

                            <div className="mt-5 space-y-3">
                                <p className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                                    Nama pelapor: {complaint.name}
                                </p>

                                <p className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                                    <LinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                                    Kanal: {complaint.channel?.nama || "-"}
                                </p>

                                <p className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                                    <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                                    Topik: {complaint.title}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </PageShell>
    );
}
