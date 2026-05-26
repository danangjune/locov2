import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Clock3,
    ImageIcon,
    MapPin,
    MessageSquareText,
    Ticket,
} from "lucide-react";

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

    if (days > 0) {
        return `${days} hari ${hours} jam`;
    }

    if (hours > 0) {
        return `${hours} jam ${minutes} menit`;
    }

    if (minutes > 0) {
        return `${minutes} menit ${seconds} detik`;
    }

    return `${seconds} detik`;
}

function getStatusStyle(status = "") {
    const text = String(status).toLowerCase();

    if (
        text.includes("selesai") ||
        text.includes("diselesaikan") ||
        text.includes("ditutup")
    ) {
        return "bg-emerald-50/95 text-emerald-700 ring-emerald-100";
    }

    if (text.includes("diproses")) {
        return "bg-sky-50/95 text-sky-700 ring-sky-100";
    }

    if (text.includes("belum")) {
        return "bg-amber-50/95 text-amber-700 ring-amber-100";
    }

    if (text.includes("diterima")) {
        return "bg-violet-50/95 text-violet-700 ring-violet-100";
    }

    return "bg-slate-50/95 text-slate-700 ring-slate-100";
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
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-rose-700 ring-1 ring-white/60 backdrop-blur">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate">{duration}</span>
        </span>
    );
}

export default function ComplaintCard({ complaint, onOpen }) {
    const statusClassName = useMemo(
        () => getStatusStyle(complaint.lastStatus),
        [complaint.lastStatus],
    );

    return (
        <motion.button
            whileHover={{ y: -4 }}
            onClick={onOpen}
            className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-left shadow-sm shadow-slate-100 transition hover:border-sky-200 hover:shadow-xl"
        >
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {complaint.thumbnail ? (
                    <img
                        src={complaint.thumbnail}
                        alt={complaint.title}
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-500">
                        <ImageIcon className="h-10 w-10" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/20" />

                <div className="absolute left-4 top-4 max-w-[58%]">
                    <span
                        className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-black ring-1 backdrop-blur ${statusClassName}`}
                    >
                        <span className="truncate">
                            {complaint.lastStatus || "Status Aduan"}
                        </span>
                    </span>
                </div>

                <div className="absolute right-4 top-4 max-w-[40%]">
                    <RunningDuration
                        from={complaint.lastStatusAt}
                        hidden={complaint.isFinished}
                    />
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <p className="line-clamp-1 text-sm font-black text-white">
                        {complaint.title}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-sky-100">
                        {complaint.location}
                    </p>
                </div>
            </div>

            <div className="p-5">
                <div className="grid gap-2 rounded-3xl bg-slate-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Ticket className="h-4 w-4 shrink-0 text-sky-600" />
                        <span className="line-clamp-1">
                            Tiket #{complaint.noTicket}
                        </span>
                    </p>

                    <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock3 className="h-4 w-4 shrink-0 text-sky-600" />
                        <span className="line-clamp-1">
                            Update terakhir:{" "}
                            {complaint.lastStatusAtLabel || "-"}
                        </span>
                    </p>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {complaint.summary || complaint.description}
                </p>

                <div className="mt-4 space-y-2 border-t border-dashed border-slate-100 pt-4">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <MapPin className="h-4 w-4 shrink-0 text-sky-600" />
                        <span className="line-clamp-1">
                            {complaint.location}
                        </span>
                    </p>

                    <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <MessageSquareText className="h-4 w-4 shrink-0 text-sky-600" />
                        <span>
                            {complaint.totalHistory} riwayat proses •{" "}
                            {complaint.totalImages} bukti
                        </span>
                    </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-sky-700">
                    Lihat detail aduan
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </motion.button>
    );
}
