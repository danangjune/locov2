import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Grid3X3,
    Building2,
    Users,
    ShieldCheck,
    Link as LinkIcon,
    LockKeyhole,
    ExternalLink,
    CalendarDays,
    ChevronRight,
    Bell,
    MapPin,
    Star,
    Sparkles,
    ArrowRight,
    Smartphone,
    BriefcaseBusiness,
    GraduationCap,
    HeartPulse,
    Landmark,
    FileCheck2,
    Megaphone,
    Globe2,
    UserRoundCheck,
    CloudSun,
    ScrollText,
    Menu,
    X,
    BarChart3,
    Wifi,
    Leaf,
    ShoppingBag,
    Archive,
    BookOpen,
    ShieldAlert,
    Bus,
    Home,
    Scale,
    Coins,
    Handshake,
    Newspaper,
    HelpCircle,
    Mail,
    Phone,
    MapPinned,
    Clock3,
    CheckCircle2,
    ArrowLeft,
    Filter,
    Eye,
    Settings,
    Database,
    User,
    KeyRound,
    Info,
    Layers3,
    CalendarCheck2,
    MessageCircle,
    FileQuestion,
    ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useHashRoute } from "./hooks/useHashRoute";
import { fetchAllAppsFromApi } from "./api/appsApi";
import { classNames, mapApiApp } from "./utils/helpers";
import {
    appData,
    newsData,
    agendaGovernmentData,
    agendaPublicData,
    allAgendaData,
    appPalettes,
} from "./data/staticData";

import PageShell from "./components/layout/PageShell";
import PageHero from "./components/layout/PageHero";
import SectionHeader from "./components/layout/SectionHeader";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import ModeBadge from "./components/apps/ModeBadge";
import AppCard from "./components/apps/AppCard";
import NewsCard from "./components/news/NewsCard";
import MiniCalendar from "./components/agenda/MiniCalendar";
import AgendaCard from "./components/agenda/AgendaCard";

import InfoPage from "./pages/InfoPage";
import GuidePage from "./pages/GuidePage";
import HelpPage from "./pages/HelpPage";
import LoginPage from "./pages/LoginPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AgendaPage from "./pages/AgendaPage";
import AgendaDetailPage from "./pages/AgendaDetailPage";
import AppsPage from "./pages/AppsPage";
import AppDetailPage from "./pages/AppDetailPage";
import HomePage from "./pages/HomePage";

export default function App() {
    const [route, navigate] = useHashRoute();
    const [activeType, setActiveType] = useState("Semua");
    const [activeCategory, setActiveCategory] = useState("Semua Aplikasi");

    const [backendApps, setBackendApps] = useState([]);
    const [appsLoading, setAppsLoading] = useState(true);
    const [appsError, setAppsError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadApps() {
            try {
                setAppsLoading(true);
                setAppsError("");

                const result = await fetchAllAppsFromApi();

                if (!isMounted) return;

                const mappedApps = result.data.map((item, index) =>
                    mapApiApp(item, index),
                );

                setBackendApps(mappedApps);

                console.log("PECUT apps backend loaded:", {
                    total_api: result?.meta?.total,
                    public_total: result?.meta?.public_total,
                    asn_total: result?.meta?.asn_total,
                    total_loaded: mappedApps.length,
                    sample: mappedApps.slice(0, 3),
                });
            } catch (error) {
                if (!isMounted) return;

                console.error("PECUT apps backend error:", error);
                setAppsError(error.message || "Gagal memuat aplikasi.");
                setBackendApps([]);
            } finally {
                if (isMounted) {
                    setAppsLoading(false);
                }
            }
        }

        loadApps();

        return () => {
            isMounted = false;
        };
    }, []);

    const appsForView = backendApps.length ? backendApps : appData;

    const [page, slug] = route.split("/");

    const renderPage = () => {
        if (page === "apps")
            return (
                <AppsPage
                    navigate={navigate}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    apps={appsForView}
                    appsLoading={appsLoading}
                    appsError={appsError}
                />
            );
        if (page === "app")
            return (
                <AppDetailPage
                    slug={slug}
                    navigate={navigate}
                    apps={appsForView}
                />
            );
        if (page === "news" && slug)
            return <NewsDetailPage slug={slug} navigate={navigate} />;
        if (page === "news") return <NewsPage navigate={navigate} />;
        if (page === "agenda" && slug)
            return <AgendaDetailPage slug={slug} navigate={navigate} />;
        if (page === "agenda") return <AgendaPage navigate={navigate} />;
        if (page === "login") return <LoginPage navigate={navigate} />;
        if (page === "info") return <InfoPage navigate={navigate} />;
        if (page === "guide") return <GuidePage navigate={navigate} />;
        if (page === "help") return <HelpPage navigate={navigate} />;
        return (
            <HomePage
                navigate={navigate}
                setActiveType={setActiveType}
                setActiveCategory={setActiveCategory}
                apps={appsForView}
                appsLoading={appsLoading}
            />
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Header navigate={navigate} route={route} />
            {renderPage()}
            <Footer navigate={navigate} />
            <button
                onClick={() => navigate("help")}
                className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-2xl shadow-sky-200 hover:bg-sky-700"
            >
                <Bell className="h-4 w-4" /> Bantuan PECUT
            </button>
        </div>
    );
}
