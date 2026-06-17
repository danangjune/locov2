import React, { useEffect, useMemo, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import AppCard from "../../../Components/Apps/AppCard";
import SectionHeader from "../../../Components/UI/SectionHeader";
import { mapApiApp } from "../../../Utils/helpers";

function scrollCarousel(ref, direction = "right") {
    const element = ref.current;
    if (!element) return;

    const amount = Math.max(320, Math.floor(element.clientWidth * 0.85));

    element.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
    });
}

function sectionKey(section, index) {
    return String(section?.id || section?.slug || section?.title || index);
}

function normalizeApps(items = []) {
    return items.map((item, index) => {
        const app = item?.app || item?.apps || item;
        return mapApiApp(app, index);
    });
}

function openApp(app) {
    if (app?.slug) {
        router.visit(`/apps/${app.slug}`);
        return;
    }

    if (app?.id) {
        router.visit(`/apps/${app.id}`);
        return;
    }

    router.visit("/apps");
}

export default function HomeAppSections({ sections = [] }) {
    const scrollRef = useRef(null);
    const [activeKey, setActiveKey] = useState("");

    const rows = useMemo(() => {
        if (!Array.isArray(sections)) return [];

        return sections
            .filter((section) => Array.isArray(section?.items) && section.items.length > 0)
            .map((section, index) => ({
                ...section,
                key: sectionKey(section, index),
            }));
    }, [sections]);

    useEffect(() => {
        if (!rows.length) {
            setActiveKey("");
            return;
        }

        const activeStillExists = rows.some((section) => section.key === activeKey);

        if (!activeKey || !activeStillExists) {
            setActiveKey(rows[0].key);
        }
    }, [rows, activeKey]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
    }, [activeKey]);

    if (!rows.length) return null;

    const activeSection = rows.find((section) => section.key === activeKey) || rows[0];
    const activeApps = normalizeApps(activeSection?.items || []);

    return (
        <section className="bg-slate-50/70 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Layanan Pilihan"
                    title="Kumpulan Aplikasi Prioritas"
                    subtitle="Pilih salah satu section untuk menampilkan aplikasi yang sudah diatur dari admin. Section lain disembunyikan agar beranda tetap rapi."
                />

                <div className="mt-8 flex gap-3 overflow-x-auto pb-2 overflow-y-auto" role="tablist">
                    {rows.map((section) => {
                        const isActive = section.key === activeSection.key;
                        const total = Array.isArray(section.items) ? section.items.length : 0;

                        return (
                            <button
                                key={section.key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveKey(section.key)}
                                className={[
                                    "shrink-0 rounded-full px-5 py-3 text-sm font-black ring-1 transition",
                                    isActive
                                        ? "bg-sky-600 text-white shadow-xl shadow-sky-100 ring-sky-600"
                                        : "bg-white text-slate-600 ring-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:ring-sky-100",
                                ].join(" ")}
                            >
                                <span>{section.title || "Section"}</span>
                                <span
                                    className={[
                                        "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 text-slate-500",
                                    ].join(" ")}
                                >
                                    {total}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-[2rem] bg-white/70 p-4 shadow-sm shadow-slate-100 ring-1 ring-slate-100 sm:p-6">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                                {activeApps.length} Aplikasi
                            </p>
                            <h3 className="mt-2 text-2xl font-black text-slate-950">
                                {activeSection.title || "Section Beranda"}
                            </h3>
                            {activeSection.description ? (
                                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                                    {activeSection.description}
                                </p>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={() => router.visit("/apps")}
                            className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-lg shadow-slate-200 hover:bg-sky-700"
                        >
                            Jelajahi Semua
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => scrollCarousel(scrollRef, "left")}
                            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 shadow-xl shadow-slate-200 transition hover:bg-sky-50 md:flex"
                            aria-label={`Geser ${activeSection.title || "section"} ke kiri`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollCarousel(scrollRef, "right")}
                            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 shadow-xl shadow-slate-200 transition hover:bg-sky-50 md:flex"
                            aria-label={`Geser ${activeSection.title || "section"} ke kanan`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-16 bg-gradient-to-r from-white/90 to-transparent md:block" />
                        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-16 bg-gradient-to-l from-white/90 to-transparent md:block" />

                        <div
                            ref={scrollRef}
                            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 md:px-12"
                        >
                            {activeApps.map((app, index) => (
                                <div
                                    key={app.slug || app.id || `${activeSection.key}-${index}`}
                                    className="min-w-[280px] max-w-[280px] snap-start"
                                >
                                    <AppCard
                                        app={app}
                                        compact
                                        index={index}
                                        onOpen={() => openApp(app)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
