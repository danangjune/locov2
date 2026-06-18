import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { BookMarked, Menu, X, UserCircle, LayoutDashboard, LogOut } from "lucide-react";
import { classNames } from "../../Utils/helpers";

const navItems = [
    { href: "/", key: "home", label: "Beranda" },
    { href: "/kediri", key: "kediri", label: "Selayang Pandang" },
    { href: "/apps", key: "apps", label: "Aplikasi" },
    { href: "/complaints", key: "complaints", label: "Aduan Warga" },
    { href: "/news", key: "news", label: "Berita" },
    { href: "/agenda", key: "agenda", label: "Agenda" },
    { href: "/guide", key: "guide", label: "Panduan" },
];

export default function Header({ currentRoute = "home" }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { props } = usePage();

    const user = props?.auth?.user ?? null;
    const ssoLoginUrl = props?.routes?.sso_login ?? "/auth/login";
    const dashboardUrl = props?.routes?.admin_dashboard ?? "/admin/dashboard";
    const logoutUrl = props?.routes?.logout ?? "/logout";

    const isActive = (key) => {
        if (key === "aduan") return currentRoute === "aduan";
        return currentRoute === key;
    };

    const redirectToSSO = () => {
        const redirect = encodeURIComponent(
            window.location.pathname + window.location.search + window.location.hash,
        );

        const url = ssoLoginUrl.includes("?")
            ? `${ssoLoginUrl}&redirect=${redirect}`
            : `${ssoLoginUrl}?redirect=${redirect}`;

        window.location.href = url;
    };

    const logout = () => {
        router.post(logoutUrl, {}, {
            preserveScroll: false,
            onFinish: () => {
                window.location.href = "/";
            },
        });
    };

    const goTo = (href) => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);

        if (href.startsWith("/#")) {
            if (window.location.pathname !== "/") {
                window.location.href = href;
                return;
            }

            const id = href.replace("/#", "");
            const target = document.getElementById(id);

            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            return;
        }

        router.visit(href);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="Kembali ke Beranda PECUT">
                    <img
                        src="/images/logo-pecut-full-transparan.png"
                        alt="PECUT Kota Kediri"
                        className="h-9 max-w-[180px] object-contain sm:h-10 sm:max-w-[230px] md:h-11 md:max-w-[270px] xl:h-12 xl:max-w-[320px]"
                    />
                </Link>

                <nav className="hidden min-w-0 items-center gap-5 text-sm font-bold text-slate-600 xl:flex">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => goTo(item.href)}
                            className={classNames(
                                "whitespace-nowrap transition hover:text-sky-600",
                                isActive(item.key) ? "text-sky-700" : "",
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="hidden shrink-0 items-center gap-3 xl:flex">
                    <button
                        type="button"
                        onClick={() => router.visit("/survey-kepuasan")}
                        className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-100"
                    >
                        <BookMarked className="h-4 w-4" />
                        Survey Kepuasan
                    </button>

                    {user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((value) => !value)}
                                className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-sky-50"
                            >
                                <UserCircle className="h-5 w-5 text-sky-600" />
                                <span className="max-w-[130px] truncate">{user.name}</span>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/80">
                                    <div className="border-b border-slate-100 bg-sky-50/60 px-4 py-3">
                                        <p className="text-sm font-black text-slate-900">{user.name}</p>
                                        <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{user.email}</p>
                                    </div>

                                    {user.role_id === 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                window.location.href = dashboardUrl;
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard Admin
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={redirectToSSO}
                            className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg shadow-amber-100 transition hover:scale-[1.02]"
                        >
                            Masuk SSO
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className="shrink-0 rounded-2xl border border-sky-100 p-2 xl:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Buka menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-sky-100 bg-white px-4 py-4 xl:hidden">
                    <div className="grid gap-3 text-sm font-bold text-slate-600">
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => goTo(item.href)}
                                className={classNames(
                                    "rounded-2xl px-3 py-2 text-left hover:bg-sky-50 hover:text-sky-700",
                                    isActive(item.key) ? "bg-sky-50 text-sky-700" : "",
                                )}
                            >
                                {item.label}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => goTo("/info")}
                            className="rounded-2xl px-3 py-2 text-left hover:bg-sky-50 hover:text-sky-700"
                        >
                            Info Layanan
                        </button>

                        {user ? (
                            <div className="mt-2 rounded-3xl bg-slate-50 p-3">
                                <p className="px-2 text-sm font-black text-slate-900">{user.name}</p>
                                <p className="truncate px-2 text-xs font-semibold text-slate-500">{user.email}</p>

                                {user.role_id === 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            window.location.href = dashboardUrl;
                                        }}
                                        className="mt-3 w-full rounded-full border border-sky-100 bg-white px-4 py-2 font-black text-slate-900"
                                    >
                                        Dashboard
                                    </button>                                    
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="mt-2 w-full rounded-full bg-red-500 px-4 py-2 font-black text-white"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    redirectToSSO();
                                }}
                                className="mt-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-2 font-black text-slate-900"
                            >
                                Masuk SSO
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
