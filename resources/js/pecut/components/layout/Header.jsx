import { useState } from "react";
import { Bell, Menu, Sparkles, X } from "lucide-react";
import { classNames } from "../../utils/helpers";

export default function Header({ navigate, route }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        ["home", "Beranda"],
        ["apps", "Aplikasi"],
        ["news", "Berita"],
        ["agenda", "Agenda"],
        ["help", "Bantuan"],
    ];

    const isActive = (path) => route.split("/")[0] === path;

    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("home")}
                    className="flex items-center gap-3 text-left"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-600 text-white shadow-lg shadow-sky-200">
                        <Sparkles className="h-7 w-7" />
                    </div>

                    <div>
                        <p className="text-xl font-black leading-none tracking-tight text-slate-900">
                            PECUT
                        </p>
                        <p className="text-xs font-semibold text-sky-700">
                            Portal Efisien Cepat Mudah Terpadu
                        </p>
                    </div>
                </button>

                <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
                    {navItems.map(([path, label]) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={classNames(
                                "hover:text-sky-600",
                                isActive(path) ? "text-sky-700" : "",
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <button
                        onClick={() => navigate("info")}
                        className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-100"
                    >
                        <Bell className="h-4 w-4" />
                        Info Layanan
                    </button>

                    <button
                        onClick={() => navigate("login")}
                        className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg shadow-amber-100 transition hover:scale-[1.02]"
                    >
                        Masuk SSO
                    </button>
                </div>

                <button
                    className="rounded-2xl border border-sky-100 p-2 lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-sky-100 bg-white px-4 py-4 lg:hidden">
                    <div className="grid gap-3 text-sm font-bold text-slate-600">
                        {navItems.map(([path, label]) => (
                            <button
                                key={path}
                                onClick={() => {
                                    navigate(path);
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left"
                            >
                                {label}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                navigate("info");
                                setMobileMenuOpen(false);
                            }}
                            className="text-left"
                        >
                            Info Layanan
                        </button>

                        <button
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
