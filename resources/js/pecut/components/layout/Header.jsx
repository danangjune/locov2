import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { classNames } from "../../utils/helpers";

export default function Header({ navigate, route }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        ["home", "Beranda"],
        ["apps", "Aplikasi"],
        ["aduan", "Aduan Warga"],
        ["news", "Berita"],
        ["agenda", "Agenda"],
        ["help", "Bantuan"],
    ];

    const isActive = (path) => {
        const current = route.split("/")[0];

        if (path === "aduan") {
            return current === "aduan";
        }

        return current === path;
    };

    const goToAduan = () => {
        navigate("home");

        window.setTimeout(() => {
            const target = document.getElementById("aduan-warga");

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 150);
    };

    const handleNavClick = (path) => {
        if (path === "aduan") {
            goToAduan();
            return;
        }

        navigate(path);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => navigate("home")}
                    className="flex min-w-0 shrink-0 items-center"
                    aria-label="Kembali ke Beranda PECUT"
                >
                    <img
                        src="/images/logo-pecut-full (2).png"
                        alt="PECUT Kota Kediri"
                        className="h-9 max-w-[180px] object-contain sm:h-10 sm:max-w-[230px] md:h-11 md:max-w-[270px] xl:h-12 xl:max-w-[320px]"
                    />
                </button>

                <nav className="hidden min-w-0 items-center gap-6 text-sm font-bold text-slate-600 xl:flex">
                    {navItems.map(([path, label]) => (
                        <button
                            key={path}
                            type="button"
                            onClick={() => handleNavClick(path)}
                            className={classNames(
                                "whitespace-nowrap transition hover:text-sky-600",
                                isActive(path) ? "text-sky-700" : "",
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="hidden shrink-0 items-center gap-3 xl:flex">
                    <button
                        type="button"
                        onClick={() => navigate("info")}
                        className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-100"
                    >
                        <Bell className="h-4 w-4" />
                        Info Layanan
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("login")}
                        className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg shadow-amber-100 transition hover:scale-[1.02]"
                    >
                        Masuk SSO
                    </button>
                </div>

                <button
                    type="button"
                    className="shrink-0 rounded-2xl border border-sky-100 p-2 xl:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Buka menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-sky-100 bg-white px-4 py-4 xl:hidden">
                    <div className="grid gap-3 text-sm font-bold text-slate-600">
                        {navItems.map(([path, label]) => (
                            <button
                                key={path}
                                type="button"
                                onClick={() => {
                                    handleNavClick(path);
                                    setMobileMenuOpen(false);
                                }}
                                className={classNames(
                                    "rounded-2xl px-3 py-2 text-left hover:bg-sky-50 hover:text-sky-700",
                                    isActive(path)
                                        ? "bg-sky-50 text-sky-700"
                                        : "",
                                )}
                            >
                                {label}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => {
                                navigate("info");
                                setMobileMenuOpen(false);
                            }}
                            className="rounded-2xl px-3 py-2 text-left hover:bg-sky-50 hover:text-sky-700"
                        >
                            Info Layanan
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                navigate("login");
                                setMobileMenuOpen(false);
                            }}
                            className="mt-2 rounded-full bg-amber-300 px-4 py-2 font-black text-slate-900"
                        >
                            Masuk SSO
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
