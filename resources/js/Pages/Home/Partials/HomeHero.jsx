import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, CloudSun, Link as LinkIcon, LockKeyhole } from "lucide-react";

function safeSlides(slides = []) {
    const rows = Array.isArray(slides) ? slides.filter(Boolean) : [];

    if (rows.length) return rows;

    return [
        {
            id: "default",
            title: "Semua Aplikasi Pemerintah Kota Kediri Dalam Satu Portal",
            subtitle: "Portal satu pintu layanan digital Kota Kediri",
            body: "PECUT menghubungkan layanan ASN Digital dan Public Digital agar masyarakat, ASN, dan perangkat daerah dapat menemukan aplikasi, layanan, berita, serta agenda kota dengan cepat.",
            url: "/apps",
            button_label: "Jelajahi Aplikasi",
            secondary_label: "Panduan Pengguna",
            secondary_url: "/guide",
            image: null,
        },
    ];
}

export default function HomeHero({ slides = [], stats = {}, onNavigate }) {
    const items = useMemo(() => safeSlides(slides), [slides]);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeSlide = items[activeIndex] || items[0];
    const hasMany = items.length > 1;

    function isExternalUrl(url = "") {
        return (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("mailto:") ||
            url.startsWith("tel:") ||
            url.startsWith("https://wa.me") ||
            url.startsWith("whatsapp://")
        );
    }
    const goToUrl = (url = "/apps") => {
        if (!url) return;

        if (isExternalUrl(url)) {
            window.open(url, "_blank");
            return;
        }

        if (typeof onNavigate === "function") {
            onNavigate(url);
            return;
        }

        window.location.href = url;
    };

    const nextSlide = () => {
        setActiveIndex((current) => (current + 1) % items.length);
    };

    const prevSlide = () => {
        setActiveIndex((current) => (current - 1 + items.length) % items.length);
    };

    const statRows = [
        [stats?.appsCount ?? "...", "Aplikasi Terdata"],
        [stats?.spaceCount ?? "2", "Ruang Portal"],
        [stats?.accessLabel ?? "24/7", "Akses Digital"],
    ];

    useEffect(() => {
        if (!hasMany) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % items.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [hasMany, items.length]);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                <motion.div
                    key={`text-${activeSlide?.id || activeIndex}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    {activeSlide?.subtitle ? (
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                            {activeSlide.subtitle}
                        </div>
                    ) : null}

                    <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                        {activeSlide?.title}
                    </h1>

                    {activeSlide?.body ? (
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            {activeSlide.body}
                        </p>
                    ) : null}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {activeSlide?.url ? (
                            <button
                                onClick={() => goToUrl(activeSlide.url)}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-200 hover:bg-sky-700"
                            >
                                {activeSlide?.button_label || "Jelajahi Aplikasi"}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : null}

                        {activeSlide?.secondary_url ? (
                            <button
                                onClick={() => goToUrl(activeSlide.secondary_url)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                            >
                                {activeSlide?.secondary_label || "Panduan Pengguna"}
                            </button>
                        ) : null}
                    </div>

                    <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                        {statRows.map(([value, label]) => (
                            <div key={label} className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-sm shadow-sky-100 backdrop-blur">
                                <p className="text-2xl font-black text-sky-700">{value}</p>
                                <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    key={`visual-${activeSlide?.id || activeIndex}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="relative z-10"
                >
                    <div className="relative overflow-hidden rounded-[2.25rem] p-4 ">
                        {activeSlide?.image ? (
                            <img
                                src={activeSlide.image}
                                alt={activeSlide.title || "Slide Beranda"}
                                className="h-[360px] w-full rounded-[1.75rem] object-contain"
                                loading="eager"
                            />
                        ) : (
                            <div className="rounded-[1.75rem] bg-gradient-to-br from-sky-600 to-cyan-500 p-6 text-white">
                                <div className="grid gap-4">
                                    {[
                                        [CloudSun, "Public Digital", "Layanan masyarakat lebih mudah ditemukan."],
                                        [LockKeyhole, "ASN Digital", "Akses aplikasi internal lebih cepat."],
                                        [LinkIcon, "Integrasi Portal", "Semua tautan layanan tersedia satu pintu."],
                                    ].map(([Icon, title, desc]) => (
                                        <div key={title} className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                                            <div className="flex items-start gap-4">
                                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black">{title}</p>
                                                    <p className="mt-1 text-sm leading-6 text-white/80">{desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {hasMany ? (
                        <div className="left-7 right-7 flex items-center justify-center gap-4">
                            <div className="flex items-center justify-between gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
                                {items.map((slide, index) => (
                                    <button
                                        key={slide.id || index}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        className={[
                                            "h-2.5 rounded-full transition-all",
                                            index === activeIndex ? "w-8 bg-sky-600" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                                        ].join(" ")}
                                        aria-label={`Tampilkan slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            </div>
        </section>
    );
}
