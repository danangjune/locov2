import React from "react";
import { MessageSquareText, RefreshCw, Star, UsersRound } from "lucide-react";
import SectionHeader from "../../../Components/UI/SectionHeader";

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
}

function formatDate(value) {
    if (!value) return "-";

    try {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(value));
    } catch (_) {
        return value;
    }
}

function RatingStars({ rating = 0, limit = 5, size = "h-4 w-4" }) {
    const normalized = Number(rating) || 0;
    const max = Number(limit) || 5;

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, index) => {
                const active = normalized >= index + 1;
                const partial = !active && normalized > index;

                return (
                    <span key={index} className={`relative grid ${size} place-items-center`}>
                        <Star className={`${size} fill-slate-200 text-slate-200`} />
                        {active || partial ? (
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: active ? "100%" : `${(normalized - index) * 100}%` }}
                            >
                                <Star className={`${size} fill-amber-400 text-amber-400`} />
                            </span>
                        ) : null}
                    </span>
                );
            })}
        </div>
    );
}

function DistributionRow({ item }) {
    const percent = clamp(item?.percent || 0);

    return (
        <div className="grid grid-cols-[2.5rem_1fr_2.75rem] items-center gap-2.5">
            <div className="flex items-center gap-1 text-sm font-black text-slate-600">
                {item?.rating}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full theme-bg-primary" style={{ width: `${percent}%` }} />
            </div>
            <div className="text-right text-xs font-bold text-slate-400">{percent}%</div>
        </div>
    );
}

function CommentItem({ item }) {
    const rating = Number(item?.rating || 0);

    return (
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h4 className="truncate text-sm font-black text-slate-800">
                        {item?.responder_name || "Responden"}
                    </h4>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                        {formatDate(item?.answer_at)}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-black text-amber-600 ring-1 ring-amber-100">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {rating.toFixed(0)}
                </div>
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {item?.comment || "Tidak ada komentar tertulis."}
            </p>
        </article>
    );
}

export default function HomeSatisfaction({ satisfaction }) {
    const data = satisfaction || {};
    const app = data?.app || {};
    const distribution = Array.isArray(data?.distribution) ? data.distribution : [];
    const comments = Array.isArray(data?.comments) ? data.comments : [];

    const rating = Number(app?.average_ratings || 0);
    const limit = Number(app?.limit_rate || 5);
    const totalRespondents = Number(app?.total_respondents || 0);

    if (!data?.is_available && !rating && !totalRespondents) {
        return null;
    }

    return (
        <section className="theme-bg-surface py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Survey Kepuasan"
                    title="Kepuasan Pengguna PECUT"
                    subtitle="Lihat penilaian dan masukan pengguna terhadap layanan PECUT."
                />
                <div className="grid gap-6 lg:grid-cols-[0.95fr_0.85fr_1.2fr] min-h-[250px]">
                    <div className="flex flex-col justify-between rounded-3xl bg-slate-50 p-5">
                        <div>
                            <p className="text-sm font-bold text-slate-500">{app?.name || "PECUT"}</p>

                            <div className="mt-4 flex items-end gap-2">
                                <span className="text-5xl font-black tracking-tight text-slate-950">
                                    {rating.toFixed(2)}
                                </span>
                                <span className="mb-1.5 text-base font-black text-slate-400">/ {limit}</span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <RatingStars rating={rating} limit={limit} />
                                <span className="text-xs font-bold text-slate-500">
                                    {totalRespondents} responden
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                                <UsersRound className="h-4 w-4 theme-text-primary" />
                                <p className="mt-2 text-xl font-black text-slate-950">{totalRespondents}</p>
                                <p className="text-xs font-bold text-slate-400">Responden</p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                                <MessageSquareText className="h-4 w-4 theme-text-primary" />
                                <p className="mt-2 text-xl font-black text-slate-950">{comments.length}</p>
                                <p className="text-xs font-bold text-slate-400">Komentar</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-5">
                        <h3 className="text-sm font-black text-slate-950">Distribusi Rating</h3>
                        <div className="mt-4 space-y-6">
                            {distribution.length ? (
                                distribution.map((item) => (
                                    <DistributionRow key={item.rating} item={item} />
                                ))
                            ) : (
                                <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                                    Distribusi rating belum tersedia.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-black text-slate-950">Komentar Terbaru</h3>
                            {comments.length ? (
                                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-500">
                                    {comments.length} komentar
                                </span>
                            ) : null}
                        </div>

                        {comments.length ? (
                            <div className="mt-4 max-h-48 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {comments.map((item) => (
                                    <CommentItem key={`${item.respondent_id}-${item.answer_at}`} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 rounded-2xl bg-slate-50 p-6 text-center">
                                <MessageSquareText className="mx-auto h-7 w-7 theme-text-primary" />
                                <p className="mt-3 text-sm font-bold text-slate-600">
                                    Belum ada komentar PECUT.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {!data?.is_available && data?.source_error ? (
                    <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                        {data.source_error}
                    </p>
                ) : null}
            </div>
        </section>
    );
}
