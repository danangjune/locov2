import { Head, Link, router } from "@inertiajs/react";
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
    MapPin,
    MessageSquareText,
    ShieldCheck,
    Ticket,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import ComplaintCard from "../../Components/Complaints/ComplaintCard";
import { classNames } from "../../Utils/helpers";

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

function getTextValue(value, fallback = "-") {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
        return value;
    }

    if (Array.isArray(value)) {
        const result = value
            .map((item) => getTextValue(item, ""))
            .filter(Boolean)
            .join(", ");

        return result || fallback;
    }

    if (typeof value === "object") {
        return (
            value.nama ||
            value.name ||
            value.title ||
            value.label ||
            value.status ||
            value.no_ticket ||
            fallback
        );
    }

    return fallback;
}

function isFinishedStatus(status = "") {
    const text = String(status).toLowerCase();

    return text.includes("selesai") || text.includes("diselesaikan") || text.includes("ditutup");
}

function getStatusStyle(status = "") {
    const text = String(status).toLowerCase();

    if (isFinishedStatus(text)) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (text.includes("diproses")) return "bg-sky-50 text-sky-700 ring-sky-100";
    if (text.includes("belum")) return "bg-amber-50 text-amber-700 ring-amber-100";
    if (text.includes("diterima")) return "bg-violet-50 text-violet-700 ring-violet-100";

    return "bg-slate-50 text-slate-700 ring-slate-100";
}

function getTimelineMeta(status = "", isCurrent = false) {
    const text = String(status).toLowerCase();

    if (text.includes("selesai") || text.includes("diselesaikan") || text.includes("ditutup")) {
        return {
            dot: isCurrent ? "bg-emerald-600 text-white ring-emerald-100" : "bg-emerald-50 text-emerald-700 ring-emerald-100",
            line: "bg-emerald-100",
            card: isCurrent ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100",
            badge: "bg-emerald-100 text-emerald-700",
            Icon: CheckCircle2,
        };
    }

    if (text.includes("diproses")) {
        return {
            dot: isCurrent ? "bg-sky-600 text-white ring-sky-100" : "bg-sky-50 text-sky-700 ring-sky-100",
            line: "bg-sky-100",
            card: isCurrent ? "bg-sky-50 border-sky-200" : "bg-white border-slate-100",
            badge: "bg-sky-100 text-sky-700",
            Icon: Clock3,
        };
    }

    if (text.includes("belum")) {
        return {
            dot: isCurrent ? "bg-amber-500 text-white ring-amber-100" : "bg-amber-50 text-amber-700 ring-amber-100",
            line: "bg-amber-100",
            card: isCurrent ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100",
            badge: "bg-amber-100 text-amber-700",
            Icon: Clock3,
        };
    }

    if (text.includes("diterima")) {
        return {
            dot: isCurrent ? "bg-violet-600 text-white ring-violet-100" : "bg-violet-50 text-violet-700 ring-violet-100",
            line: "bg-violet-100",
            card: isCurrent ? "bg-violet-50 border-violet-200" : "bg-white border-slate-100",
            badge: "bg-violet-100 text-violet-700",
            Icon: CheckCircle2,
        };
    }

    return {
        dot: isCurrent ? "bg-slate-700 text-white ring-slate-100" : "bg-slate-50 text-slate-700 ring-slate-100",
        line: "bg-slate-100",
        card: isCurrent ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100",
        badge: "bg-slate-100 text-slate-700",
        Icon: CircleDot,
    };
}

function RunningDuration({ from, hidden = false }) {
    const [duration, setDuration] = useState(() => (hidden ? "" : formatRunningDuration(from)));

    useEffect(() => {
        if (hidden || !from) {
            setDuration("");
            return undefined;
        }

        const update = () => setDuration(formatRunningDuration(from));
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

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="grid gap-2 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                <Icon className="h-4 w-4 text-sky-600" />
                {label}
            </div>
            <div className="text-sm font-extrabold leading-6 text-slate-800">
                {getTextValue(value)}
            </div>
        </div>
    );
}

function EvidenceGallery({ images = [], title = "Bukti aduan" }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [images.length]);

    if (!images.length) {
        return (
            <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
                Tidak ada gambar bukti yang ditampilkan.
            </div>
        );
    }

    const selectedImage = images[selectedImageIndex] || images[0];

    return (
        <div className="mt-6 space-y-4">
            <a
                href={selectedImage}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden rounded-[2rem] bg-slate-100 ring-1 ring-slate-100"
                title="Klik untuk membuka detail foto"
            >
                <img
                    src={selectedImage}
                    alt={`${title} ${selectedImageIndex + 1}`}
                    className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Foto utama</p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                            Bukti {selectedImageIndex + 1} dari {images.length}
                        </p>
                    </div>
                </div>
            </a>

            {images.length > 1 && (
                <div className="rounded-[1.5rem] bg-slate-50 p-3">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {images.map((image, index) => (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setSelectedImageIndex(index)}
                                className={classNames(
                                    "relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-2 transition",
                                    selectedImageIndex === index
                                        ? "ring-sky-500"
                                        : "ring-transparent hover:ring-sky-200",
                                )}
                                title={`Tampilkan bukti ${index + 1}`}
                            >
                                <img src={image} alt={`Thumbnail bukti ${index + 1}`} className="h-full w-full object-cover" />
                                <span className="absolute bottom-1 left-1 rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-black text-white">
                                    {index + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function HandlingTimeline({ history = [], lastStatus, lastStatusAt, isFinished }) {
    const normalizedHistory = Array.isArray(history) ? history : [];

    return (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
            <SectionHeader
                eyebrow="Status"
                title="Progress Penanganan Aduan"
                subtitle="Pantau status terkini dan tahapan penanganan laporan secara jelas."
            />

            <div className="mt-6 rounded-[1.75rem] bg-gradient-to-br from-sky-50 to-white p-5 ring-1 ring-sky-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide text-sky-600">Status terkini</p>
                        <h3 className="mt-1 text-2xl font-black text-slate-950">
                            {getTextValue(lastStatus, "Status belum tersedia")}
                        </h3>
                        <p className="mt-2 text-sm font-bold text-slate-500">
                            Pembaruan terakhir: {getTextValue(lastStatusAt, "-")}
                        </p>
                    </div>

                    <RunningDuration from={lastStatusAt} hidden={isFinished} />
                </div>
            </div>

            <div className="mt-8 space-y-0">
                {normalizedHistory.map((item, index) => {
                    const statusLabel = getTextValue(item.status, "Status");
                    const isCurrent = index === normalizedHistory.length - 1;
                    const metaTimeline = getTimelineMeta(statusLabel, isCurrent);
                    const Icon = metaTimeline.Icon;

                    return (
                        <div key={`${statusLabel}-${index}`} className="relative grid grid-cols-[48px_1fr] gap-4">
                            <div className="relative flex justify-center">
                                {index < normalizedHistory.length - 1 && (
                                    <div className={classNames("absolute top-12 h-full w-1 rounded-full", metaTimeline.line)} />
                                )}
                                <div className={classNames("relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl ring-8", metaTimeline.dot)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="pb-5">
                                <div className={classNames("rounded-[1.5rem] border p-5 transition", metaTimeline.card)}>
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={classNames("rounded-full px-3 py-1 text-xs font-black", metaTimeline.badge)}>
                                                    {isCurrent ? "Status terbaru" : `Tahap ${index + 1}`}
                                                </span>
                                                <h4 className="text-base font-black text-slate-950">{statusLabel}</h4>
                                            </div>
                                            <p className="mt-2 text-sm font-bold text-slate-500">
                                                {getTextValue(item.created_at_label, "Waktu belum tersedia")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!normalizedHistory.length && (
                    <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
                        Belum ada histori penanganan yang tersedia.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Show({ meta = {}, data = {} }) {
    const complaint = data?.complaint || null;
    const related = Array.isArray(data?.related) ? data.related : [];
    const error = data?.errors?.complaint || "";
    const images = Array.isArray(complaint?.images) ? complaint.images.filter(Boolean) : [];

    const statusClassName = useMemo(
        () => getStatusStyle(getTextValue(complaint?.lastStatus, "")),
        [complaint?.lastStatus],
    );

    if (!complaint) {
        return (
            <>
                <Head title={meta?.title || "Detail Aduan"} />
                <PublicLayout currentRoute="complaints">
                    <PageShell>
                        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">
                                <h1 className="text-3xl font-black text-red-700">Aduan tidak ditemukan</h1>
                                <p className="mt-3 text-sm font-bold text-red-600">{error || "Data aduan tidak tersedia."}</p>
                                <Link href="/complaints" className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">
                                    Kembali ke daftar aduan
                                </Link>
                            </div>
                        </section>
                    </PageShell>
                </PublicLayout>
            </>
        );
    }

    return (
        <>
            <Head title={meta?.title || complaint.title || "Detail Aduan"} />

            <PublicLayout currentRoute="complaints">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white">
                        <div className="absolute inset-0 opacity-20">
                            {complaint.thumbnail ? (
                                <img src={complaint.thumbnail} alt={complaint.title} className="h-full w-full object-cover" />
                            ) : null}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />

                        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <button
                                type="button"
                                onClick={() => router.visit("/complaints")}
                                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" /> Kembali ke daftar aduan
                            </button>

                            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-4 py-2 text-sm font-black text-sky-100 ring-1 ring-sky-300/20">
                                            <Ticket className="h-4 w-4" /> Tiket #{getTextValue(complaint.noTicket)}
                                        </span>

                                        <span className={classNames("inline-flex items-center rounded-full px-4 py-2 text-sm font-black ring-1", statusClassName)}>
                                            {getTextValue(complaint.lastStatus, "Status Aduan")}
                                        </span>

                                        <RunningDuration from={complaint.lastStatusAt} hidden={complaint.isFinished} />
                                    </div>

                                    <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                        {getTextValue(complaint.title, "Detail Aduan")}
                                    </h1>

                                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
                                        {getTextValue(complaint.summary || complaint.description)}
                                    </p>
                                </div>

                                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                                    <p className="text-sm font-black uppercase tracking-wide text-sky-100">Informasi Singkat</p>
                                    <div className="mt-5 space-y-4 text-sm font-bold text-slate-100">
                                        <p className="flex gap-3"><CalendarDays className="h-5 w-5 shrink-0 text-sky-200" /> {getTextValue(complaint.createdAtLabel)}</p>
                                        <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-sky-200" /> {getTextValue(complaint.location)}</p>
                                        <p className="flex gap-3"><MessageSquareText className="h-5 w-5 shrink-0 text-sky-200" /> {getTextValue(complaint.totalHistory, 0)} riwayat • {images.length} bukti</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                            <div className="min-w-0 space-y-8">
                                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                    <SectionHeader
                                        eyebrow="Isi Aduan"
                                        title="Ringkasan Laporan Warga"
                                        subtitle="Informasi yang disampaikan pelapor untuk mendukung proses tindak lanjut."
                                    />

                                    <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                                        {getTextValue(complaint.description)}
                                    </p>
                                </div>

                                <HandlingTimeline
                                    history={complaint.history || []}
                                    lastStatus={complaint.lastStatus}
                                    lastStatusAt={complaint.lastStatusAt}
                                    isFinished={complaint.isFinished}
                                />

                                <div className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                    <SectionHeader
                                        eyebrow="Bukti"
                                        title="Dokumentasi Aduan"
                                        subtitle="Dokumentasi yang dilampirkan pelapor sebagai bukti pendukung laporan."
                                    />

                                    <EvidenceGallery images={images} title={complaint.title} />
                                </div>

                                {complaint.mapEmbed && (
                                    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
                                        <div className="p-6">
                                            <SectionHeader
                                                eyebrow="Lokasi"
                                                title="Peta Lokasi Aduan"
                                                subtitle="Lokasi laporan berdasarkan informasi peta yang disampaikan pelapor."
                                            />
                                        </div>
                                        <iframe
                                            src={complaint.mapEmbed}
                                            title="Lokasi Aduan"
                                            className="h-96 w-full border-0"
                                            loading="lazy"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {complaint.maps && (
                                    <a href={complaint.maps} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-3xl bg-sky-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-sky-100 transition hover:bg-sky-700">
                                        Buka di Google Maps <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>

                            <aside className="space-y-6">
                                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                    <h2 className="text-xl font-black text-slate-900">Detail Informasi</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Informasi utama aduan dirangkum dalam satu panel agar lebih mudah dibaca.
                                    </p>

                                    <div className="mt-5 divide-y divide-slate-100">
                                        <InfoRow icon={Ticket} label="Nomor Tiket" value={"#" + complaint.noTicket} />
                                        <InfoRow icon={CalendarDays} label="Tanggal Aduan" value={complaint.createdAtLabel} />
                                        <InfoRow icon={MapPin} label="Lokasi" value={complaint.location} />
                                        <InfoRow icon={Globe2} label="Kanal" value={complaint.channel} />
                                        <InfoRow icon={ShieldCheck} label="Status Terakhir" value={complaint.lastStatus} />
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                    <h2 className="text-xl font-black text-slate-900">Perangkat Daerah Terkait</h2>

                                    <div className="mt-5 space-y-3">
                                        {complaint.skpd?.length ? complaint.skpd.map((item, index) => (
                                            <div key={`${getTextValue(item)}-${index}`} className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4 text-sm font-black text-slate-700">
                                                <Building2 className="h-5 w-5 shrink-0 text-sky-600" /> {getTextValue(item)}
                                            </div>
                                        )) : (
                                            <div className="rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                                                Data perangkat daerah belum tersedia.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
                                    <FileText className="h-8 w-8 text-sky-600" />
                                    <h2 className="mt-4 text-xl font-black text-slate-900">Catatan Tampilan</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Data ini ditampilkan untuk kebutuhan transparansi informasi publik. Data sensitif tetap mengikuti kebijakan publikasi yang berlaku.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </section>

                    {related.length ? (
                        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                            <SectionHeader
                                eyebrow="Aduan Lainnya"
                                title="Aduan terbaru yang juga bisa dipantau"
                                subtitle="Laporan warga terbaru lainnya yang dapat Anda pantau."
                            />

                            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {related.map((item) => (
                                    <ComplaintCard
                                        key={item.slug || item.id || item.noTicket}
                                        complaint={item}
                                        onOpen={() => router.visit(`/complaints/${item.slug || item.id}`)}
                                    />
                                ))}
                            </div>
                        </section>
                    ) : null}
                </PageShell>
            </PublicLayout>
        </>
    );
}
