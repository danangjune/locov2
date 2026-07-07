import React, { useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    AppWindow,
    BookOpen,
    ChevronDown,
    ExternalLink,
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    Settings2,
    UserCircle,
    Database,
    Layers3,
    MonitorPlay,
    HelpCircle,
    Palette,
    Image,
    X,
} from "lucide-react";
import "sweetalert2/dist/sweetalert2.min.css";
import ThemeStyle from "../Components/Theme/ThemeStyle";
import BrandLogo from "../Components/Brand/BrandLogo";

const navigation = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        match: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    { type: 'divider', title: 'Manajemen Aplikasi' },
    {
        title: "Apps",
        href: "/admin/apps",
        match: "/admin/apps",
        icon: AppWindow,
    },
    { type: 'divider', title: 'Beranda' },
    {
        title: "Slide Hero Beranda",
        href: "/admin/home-slides",
        match: "/admin/home-slides",
        icon: MonitorPlay,
    },
    {
        title: "Section Beranda",
        href: "/admin/home-sections",
        match: "/admin/home-sections",
        icon: Layers3,
    },
    {
        title: "Halaman Portal",
        href: "/admin/portal-pages",
        match: "/admin/portal-pages",
        icon: FileText,
    },
    { type: 'divider', title: 'Master Data' },
    {
        title: "Master Referensi",
        href: "/admin/references",
        match: "/admin/references",
        icon: Database,
    },
    { type: 'divider', title: 'Panduan' },
    {
        title: "Panduan",
        href: "/admin/panduan",
        match: "/admin/panduan",
        icon: BookOpen,
    },
    { type: 'divider', title: 'Footer' },
    {
        title: "Content Footer",
        href: "/admin/content-footer",
        match: "/admin/content-footer",
        icon: FileText,
    },
    {
        title: "Pengaturan Footer",
        href: "/admin/footer-setting",
        match: "/admin/footer-setting",
        icon: Settings2,
    },
    { type: 'divider', title: 'Theme' },
    {
        title: "Logo Portal",
        href: "/admin/logo-setting",
        match: "/admin/logo-setting",
        icon: Image,
    },
    {
        title: "Tampilan Portal",
        href: "/admin/theme-setting",
        match: "/admin/theme-setting",
        icon: Palette,
    },
];

function isActive(currentUrl, item) {
    if (!item.match) return false;
    return currentUrl === item.match || currentUrl.startsWith(`${item.match}/`);
}

export default function AdminLayout({
    title = "Admin Panel",
    subtitle = "Kelola data Portal PECUT Kota Kediri.",
    children,
    actions = null,
}) {
    const { props, url } = usePage();
    const authUser = props?.auth?.user || props?.user || null;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const userName = authUser?.name || "Admin PECUT";

    const breadcrumbs = useMemo(() => {
        const path = String(url || "").split("?")[0];
        const segments = path.split("/").filter(Boolean);
        return segments.map((segment, index) => {
            const label = segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            return { label, href };
        });
    }, [url]);

    const handleLogout = () => {
        router.post("/logout");
    };

    const SidebarContent = ({ mobile = false }) => (
        <div className="flex h-full flex-col theme-bg-surface">
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">

                {!sidebarCollapsed && (
                    <Link href="/" className="flex items-center gap-3" title="Buka Portal">
                        <BrandLogo
                            variant="header"
                            mode="dynamic"
                            className="h-11 w-auto"
                        />
                    </Link>
                )}

                {mobile ? (
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed((value) => !value)}
                        className="hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:inline-flex"
                        title={sidebarCollapsed ? "Buka sidebar" : "Ciutkan sidebar"}
                    >
                        {sidebarCollapsed ? (
                            <span
                                className={`grid h-9 w-9 ms-1 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-white`}
                            >
                                <PanelLeftOpen className="h-5 w-5" />
                            </span>
                        ) : (
                            <span
                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-white`}
                            >
                                <PanelLeftClose className="h-5 w-5" />
                            </span>
                        )}
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
                {navigation.map((item, idx) => {
                    if (item.type === 'divider') {
                        return (
                            <div key={`divider-${idx}`} className="my-3 px-2">
                                {!sidebarCollapsed && (
                                    <>
                                        {item.title ? (
                                            <div className="mt-4 mb-2 px-3 text-xs font-bold uppercase text-slate-400">{item.title}</div>
                                        ) : null}
                                    </>
                                )}
                                <div className="h-px bg-slate-100" />
                            </div>
                        );
                    }
                    const Icon = item.icon;
                    const active = isActive(url, item);
                    const baseClass = active
                        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                        : item.disabled
                            ? "cursor-not-allowed text-slate-400"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950";

                    const content = (
                        <div
                            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${baseClass}`}
                            title={sidebarCollapsed && !mobile ? item.title : undefined}
                        >
                            <span
                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white"}`}
                            >
                                <Icon className="h-4 w-4" />
                            </span>

                            {(!sidebarCollapsed || mobile) && (
                                <>
                                    <span className="flex-1 truncate">{item.title}</span>
                                    {item.badge && (
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    );

                    if (item.disabled) {
                        return <div key={item.title}>{content}</div>;
                    }

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {content}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 p-4">
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl theme-bg-primary px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--theme-primary),black_12%)]"
                >
                    {(!sidebarCollapsed || mobile) && <span>Lihat Portal</span>}
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    );

    return (
        <>
            <ThemeStyle />
            <Head title={title} />

            <div className="min-h-screen theme-bg-page theme-text">
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-100 bg-white shadow-2xl shadow-slate-200 transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SidebarContent mobile />
                </aside>

                <aside
                    className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-100 bg-white transition-all duration-300 lg:block ${sidebarCollapsed ? "w-24" : "w-72"}`}
                >
                    <SidebarContent />
                </aside>

                <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
                    <header className="sticky top-0 z-20 border-b border-slate-100 theme-bg-surface-translucent backdrop-blur-xl">
                        <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(true)}
                                    className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm lg:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                <div className="min-w-0">
                                    <div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 sm:flex">
                                        {breadcrumbs.map((crumb, index) => (
                                            <React.Fragment key={crumb.href}>
                                                <span>{crumb.label}</span>
                                                {index < breadcrumbs.length - 1 && <span>/</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">
                                        {title}
                                    </h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {actions}

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setProfileOpen((value) => !value)}
                                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm hover:border-sky-200 hover:bg-sky-50"
                                    >
                                        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                            <UserCircle className="h-5 w-5" />
                                        </span>
                                        <span className="hidden text-left sm:block">
                                            <span className="block text-sm font-black leading-tight text-slate-900">
                                                {userName}
                                            </span>
                                            <span className="block text-xs font-semibold text-slate-400">
                                                Administrator
                                            </span>
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200">
                                            <Link
                                                href="/"
                                                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Buka Portal
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Keluar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-6 rounded-3xl border border-white theme-bg-surface-translucent p-5 shadow-sm backdrop-blur-xl sm:p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                                            PECUT Admin
                                        </p>
                                        <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                                            {title}
                                        </h2>
                                        {subtitle && (
                                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl theme-bg-primary px-4 py-3 text-xs font-black uppercase tracking-wider text-white">
                                        <Settings className="h-4 w-4" />
                                        Admin Workspace
                                    </div>
                                </div>
                            </div>

                            {children}
                        </div>
                    </main>

                    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs font-semibold text-slate-500 sm:px-6 lg:px-8">
                        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Copyright © {new Date().getFullYear()} <b className="theme-text-primary">PECUT</b>.
                            </span>
                            <span>Dinas Komunikasi dan Informatika Kota Kediri</span>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
