import { useRef, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MapPin,
    Newspaper,
    Users,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import AppCard from "../../Components/Apps/AppCard";
import HomeAppSections from "./Partials/HomeAppSections";
import HomeHero from "./Partials/HomeHero";
import ComplaintStatusChecker from "../../Components/Complaints/ComplaintStatusChecker";

import { appData } from "../../Data/staticData";

import { classNames, mapApiApp } from "../../Utils/helpers";


function SupportingPanel({ icon: Icon, eyebrow, title, actionLabel, onAction, children, subtitle }) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="theme-card flex min-w-0 flex-col rounded-[2rem] p-5"
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full theme-bg-primary-soft px-3 py-1.5 text-[11px] font-black uppercase tracking-widest theme-text-primary ring-1 theme-ring-primary-soft">
                        <Icon className="h-3.5 w-3.5" />
                        {eyebrow}
                    </div>
                    <h3 className="mt-3 text-xl font-black leading-tight theme-text">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="mt-2 max-w-2xl text-sm theme-muted">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actionLabel ? (
                    <button
                        type="button"
                        onClick={onAction}
                        className="shrink-0 rounded-full theme-bg-primary-soft px-3 py-2 text-xs font-black theme-text-primary transition theme-hover-bg-primary-soft"
                    >
                        {actionLabel}
                    </button>
                ) : null}
            </div>

            <div className="min-w-0 flex-1">{children}</div>
        </motion.div>
    );
}

function CompactNotice({ children }) {
    return (
        <div className="rounded-2xl border border-dashed theme-border-primary-soft theme-bg-primary-soft px-4 py-3 text-sm font-bold theme-muted">
            {children}
        </div>
    );
}

function CompactNewsList({ items = [], onOpen }) {
    if (!items.length) {
        return <CompactNotice>Berita terbaru belum tersedia.</CompactNotice>;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <button
                    key={item.slug || item.id || item.title}
                    type="button"
                    onClick={() => onOpen(item)}
                    className="group grid w-full min-w-0 grid-cols-[76px_1fr] gap-3 rounded-2xl border theme-border-primary-soft theme-bg-surface p-2 text-left transition theme-hover-bg-primary-soft"
                >
                    <img
                        src={item.image}
                        alt={item.title || "Berita Kota Kediri"}
                        className="h-20 w-full rounded-xl object-cover"
                        loading="lazy"
                    />

                    <div className="min-w-0 py-1">
                        <p className="text-[11px] font-black uppercase tracking-wider theme-muted">
                            {item.date || item.published_label || "Kota Kediri"}
                        </p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-black leading-snug theme-text group-hover:text-sky-700">
                            {item.title || "Berita Kota Kediri"}
                        </h4>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-black theme-text-primary">
                            Baca
                            <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}

function CompactAgendaList({ items = [], onOpen }) {
    if (!items.length) {
        return <CompactNotice>Agenda terdekat belum tersedia.</CompactNotice>;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <button
                    key={item.slug || item.id || item.title}
                    type="button"
                    onClick={() => onOpen(item)}
                    className="group flex w-full min-w-0 gap-3 rounded-2xl border theme-border-primary-soft theme-bg-surface p-3 text-left transition theme-hover-bg-primary-soft"
                >
                    <img
                        src={item.image}
                        alt={item.title || "Agenda Kota Kediri"}
                        className="h-20 w-20 rounded-xl object-cover"
                        loading="lazy"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-black uppercase tracking-wider theme-muted">
                            {item.fullDate || item.start_label || "Tanggal belum tersedia"}
                        </p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-black leading-snug theme-text group-hover:text-sky-700">
                            {item.title || "Agenda Kota Kediri"}
                        </h4>
                        <p className="mt-2 flex items-center gap-1 text-xs font-bold theme-muted">
                            <MapPin className="h-3.5 w-3.5 shrink-0 theme-text-primary" />
                            <span className="line-clamp-1">{item.location || "Kota Kediri"}</span>
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const [_activeType, setActiveType] = useState("Semua");
    const [_activeCategory, setActiveCategory] = useState("Semua Aplikasi");

    const { props } = usePage();
    const auth = props?.auth || {};

    if (!auth.user?.is_asn) data.apps.items = data?.apps?.items.filter((item) => item?.category?.id === 1);

    const appsPayload = Array.isArray(data?.apps?.items) ? data.apps.items : [];
    const newsPayload = Array.isArray(data?.news?.items) ? data.news.items : [];
    const agendasPayload = Array.isArray(data?.agendas?.items)
        ? data.agendas.items
        : [];
    const homeSections = Array.isArray(data?.home_sections)
        ? data.home_sections
        : [];
    const slides = Array.isArray(data?.slides) ? data.slides : [];
    const errors = data?.errors || {};

    const apps = appsPayload.length
        ? appsPayload.map((item, index) => mapApiApp(item, index))
        : appData;

    const news = newsPayload;
    const appsLoading = false;
    const newsLoading = false;
    const newsError = errors?.news || "";
    const agendaError = errors?.agenda || "";

    const navigate = (path = "home") => {
        const cleanPath = String(path).replace(/^\/+/, "");

        if (cleanPath === "home" || cleanPath === "") {
            router.visit("/");
            return;
        }

        if (cleanPath === "apps") {
            router.visit("/apps");
            return;
        }

        if (cleanPath.startsWith("app/")) {
            router.visit(`/apps/${cleanPath.replace("app/", "")}`);
            return;
        }

        if (cleanPath === "news") {
            router.visit("/news");
            return;
        }

        if (cleanPath.startsWith("news/")) {
            router.visit(`/news/${cleanPath.replace("news/", "")}`);
            return;
        }

        if (cleanPath === "agenda") {
            router.visit("/agenda");
            return;
        }

        if (cleanPath.startsWith("agenda/")) {
            router.visit(`/agenda/${cleanPath.replace("agenda/", "")}`);
            return;
        }

        if (cleanPath.startsWith("aduan/")) {
            router.visit(`/complaints/${cleanPath.replace("aduan/", "")}`);
            return;
        }

        router.visit(`/${cleanPath}`);
    };

    const activeApps = apps.length ? apps : appData;
    const activeNews = Array.isArray(news) ? news : [];
    const activeAgendas = Array.isArray(agendasPayload) ? agendasPayload : [];

    const openNews = (newsItem) => {
        const targetUrl = newsItem?.external_url || newsItem?.detail_url || newsItem?.url;

        if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
            return;
        }

        navigate(`news/${newsItem?.slug}`);
    };

    const openAgenda = (agendaItem) => {
        const targetUrl = agendaItem?.external_url || agendaItem?.detail_url || agendaItem?.url;

        if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
            return;
        }

        if (!agendaItem?.slug) {
            navigate("agenda");
            return;
        }

        navigate(`agenda/${agendaItem.slug}`);
    };

    const compactNews = activeNews.slice(0, 3);
    const compactAgendas = activeAgendas.slice(0, 3);

    const appsByVisit = [...activeApps].sort((left, right) => {
        const leftCount = Number(left?.visit_count || 0);
        const rightCount = Number(right?.visit_count || 0);

        if (rightCount !== leftCount) {
            return rightCount - leftCount;
        }

        if (Boolean(right?.popular) !== Boolean(left?.popular)) {
            return Boolean(right?.popular) ? 1 : -1;
        }

        return String(left?.name || "").localeCompare(
            String(right?.name || ""),
        );
    });

    const hasVisitSignal = appsByVisit.some(
        (app) => Number(app?.visit_count || 0) > 0,
    );
    const selectedPopularApps = hasVisitSignal
        ? appsByVisit
        : activeApps.filter((app) => app.popular);
    const popularApps = selectedPopularApps.length
        ? selectedPopularApps.slice(0, 12)
        : appsByVisit.slice(0, 12);

    const popularScrollRef = useRef(null);

    const scrollPopularApps = (direction) => {
        if (!popularScrollRef.current) return;

        popularScrollRef.current.scrollBy({
            left: direction === "left" ? -360 : 360,
            behavior: "smooth",
        });
    };

    const asnCount = activeApps.filter(
        (app) => app.type === "ASN Digital",
    ).length;

    const publicCount = activeApps.filter(
        (app) => app.type === "Public Digital",
    ).length;

    const ruangPortal = [
        {
            title: "Public Digital",
            desc: "Kumpulan aplikasi layanan masyarakat seperti pengaduan, surat, pajak, kesehatan, pendidikan, data, dan informasi publik.",
            icon: Users,
            count: appsLoading ? "..." : `${publicCount} aplikasi`,
            gradient: "from-cyan-500 to-sky-600",
        },
    ];

    if (auth.user?.is_asn) {
        ruangPortal.push({
            title: "ASN Digital",
            desc: "Kumpulan aplikasi internal untuk ASN, OPD, kelurahan, kecamatan, administrasi, laporan, dan layanan pemerintahan.",
            icon: Building2,
            count: appsLoading ? "..." : `${asnCount} aplikasi`,
            gradient: "from-sky-600 to-blue-700",
        });
    }


    const goApps = (type = "Semua", category = null) => {
        setActiveType(type);
        if (category) {
            setActiveCategory(category);
            navigate(`apps?category_id=${category}`);
        } else {
            setActiveCategory("Semua Aplikasi");
            navigate("apps");
        }
    };

    return (
        <>
            <Head title={meta?.title || "PECUT Kota Kediri"} />
            <PublicLayout currentRoute="home">
                <PageShell>
                    <HomeHero
                        slides={slides}
                        stats={{
                            appsCount: appsLoading
                                ? "..."
                                : `${activeApps.length}+`,
                            spaceCount: "2",
                            accessLabel: "24/7",
                        }}
                        onNavigate={navigate}
                    />

                    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                        <SectionHeader
                            eyebrow="Ruang Portal"
                            title="Pilih Kebutuhan Layanan"
                            subtitle="Pilih layanan digital sesuai kebutuhan masyarakat maupun aparatur pemerintah."
                        />

                        <div className="grid gap-5 md:grid-cols-2">
                            {ruangPortal.map((item) => (
                                <motion.div
                                    key={item.title}
                                    whileHover={{ y: -4 }}
                                    className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100"
                                >
                                    <div
                                        className={classNames(
                                            "absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-br opacity-10",
                                            item.gradient,
                                        )}
                                    />

                                    <div className="relative flex items-start gap-5">
                                        <div
                                            className={classNames(
                                                "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-lg",
                                                item.gradient,
                                            )}
                                        >
                                            <item.icon className="h-8 w-8" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-black uppercase tracking-wide text-amber-500">
                                                {item.count}
                                            </p>

                                            <h3 className="mt-1 text-2xl font-black text-slate-900">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {item.desc}
                                            </p>

                                            <button
                                                onClick={() =>
                                                    goApps(
                                                        item.title,
                                                        item.title ===
                                                            "ASN Digital"
                                                            ? "2"
                                                            : "1",
                                                    )
                                                }
                                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white hover:bg-sky-700"
                                            >
                                                Lihat {item.title}
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-50/70 py-14">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <SectionHeader
                                eyebrow="Populer"
                                title="Aplikasi Paling Sering Diakses"
                                subtitle="Urutan otomatis berdasarkan jumlah kunjungan pengguna."
                                action="Lihat semua aplikasi"
                                onAction={() => goApps("Semua")}
                            />

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => scrollPopularApps("left")}
                                    className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 shadow-xl shadow-slate-200 transition hover:bg-sky-50 md:flex"
                                    aria-label="Geser aplikasi populer ke kiri"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => scrollPopularApps("right")}
                                    className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 shadow-xl shadow-slate-200 transition hover:bg-sky-50 md:flex"
                                    aria-label="Geser aplikasi populer ke kanan"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>

                                <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-16 bg-gradient-to-r from-slate-50/90 to-transparent md:block" />
                                <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-16 bg-gradient-to-l from-slate-50/90 to-transparent md:block" />

                                <div
                                    ref={popularScrollRef}
                                    className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 md:px-12"
                                >
                                    {popularApps.map((app, index) => (
                                        <div
                                            key={app.slug || app.name}
                                            className="min-w-[280px] max-w-[280px] snap-start"
                                        >
                                            <AppCard
                                                app={app}
                                                compact
                                                index={index}
                                                onOpen={() =>
                                                    navigate(`app/${app.slug}`)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <HomeAppSections sections={homeSections} />

                    <section
                        id="informasi-pendukung"
                        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
                    >
                        <SectionHeader
                            eyebrow="Pendukung Portal"
                            title="Informasi Pendukung Secara Ringkas"
                            subtitle="Temukan informasi penting seputar aduan, berita, dan agenda Kota Kediri secara ringkas dalam satu halaman."
                        />

                        <div className="grid min-w-0 gap-5 xl:grid-cols-3">
                            <div className="min-w-0">
                                <ComplaintStatusChecker
                                    compact
                                    showResultDetails={false}
                                    complaintsUrl="/complaints"
                                    title="Cek Status Aduan"
                                    subtitle="Masukkan nomor tiket Lapor Mbak Wali untuk melihat status terakhir."
                                />
                            </div>

                            <SupportingPanel
                                icon={Newspaper}
                                eyebrow="Berita"
                                title="Berita Terkini"
                                subtitle="Informasi terbaru seputar Kota Kediri."
                                actionLabel="Semua"
                                onAction={() => navigate("news")}
                            >
                                {newsError ? (
                                    <div className="mb-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                                        Berita belum berhasil dimuat dari website resmi Kota Kediri.
                                    </div>
                                ) : null}

                                {newsLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((item) => (
                                            <div
                                                key={item}
                                                className="h-24 animate-pulse rounded-2xl theme-bg-primary-soft"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <CompactNewsList items={compactNews} onOpen={openNews} />
                                )}
                            </SupportingPanel>

                            <SupportingPanel
                                icon={CalendarDays}
                                eyebrow="Agenda"
                                title="Agenda Terdekat"
                                subtitle="Jadwal kegiatan dan acara penting di Kota Kediri."
                                actionLabel="Semua"
                                onAction={() => navigate("agenda")}
                            >
                                {agendaError ? (
                                    <div className="mb-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                                        Agenda belum berhasil dimuat dari website resmi Kota Kediri.
                                    </div>
                                ) : null}

                                <CompactAgendaList items={compactAgendas} onOpen={openAgenda} />
                            </SupportingPanel>
                        </div>
                    </section>

                </PageShell>
            </PublicLayout>
        </>
    );
}
