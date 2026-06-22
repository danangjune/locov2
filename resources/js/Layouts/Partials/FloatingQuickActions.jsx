import { Link } from "@inertiajs/react";
import { Accessibility, CircleHelp, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";

const LAPOR_MBAK_WALI_URL = import.meta.env.VITE_LAPOR_MBAK_WALI_URL || "/complaints";

// Opsional: gunakan logo transparan milik PECUT untuk launcher aksesibilitas.
const ACCESSIBILITY_LOGO = "/images/logo-aksesibilitas-pecut.png";
const BANTUAN_LOGO = "/images/logo-bantuan-pecut.png";
const LAPOR_MBAK_WALI_LOGO = "/images/logo-lapor-mbak-wali.png";

function Tooltip({ children }) {
    return (
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            {children}
        </span>
    );
}

function CircleButton({ label, className = "", children, ...props }) {
    return (
        <button
            type="button"
            aria-label={label}
            className={[
                "group relative grid h-12 w-12 shrink-0 place-items-center rounded-full",
                "border border-white/80 theme-bg-primary shadow-lg shadow-slate-900/20",
                "transition duration-200 hover:-translate-y-1 hover:shadow-xl",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--theme-primary),white_72%)]",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
            <Tooltip children={label}>{label}</Tooltip>
        </button>
    );
}

function CircleLink({ label, className = "", children, external = false, href }) {
    const classes = [
        "group relative grid h-12 w-12 shrink-0 place-items-center rounded-full",
        "border border-white/80 theme-bg-primary shadow-lg shadow-slate-900/20",
        "transition duration-200 hover:-translate-y-1 hover:shadow-xl",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--theme-primary),white_72%)]",
        className,
    ].join(" ");

    const content = (
        <>
            {children}
            <Tooltip children={label}>{label}</Tooltip>
        </>
    );

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={classes}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href} aria-label={label} className={classes}>
            {content}
        </Link>
    );
}

function BrandImage({ src, alt = "", fallback, onError }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return fallback;
    }

    return (
        <img
            src={src}
            alt={alt}
            className="h-full w-full p-1 rounded-full object-contain"
            onError={(event) => {
                setFailed(true);
                onError?.(event);
            }}
        />
    );
}

export default function FloatingQuickActions() {
    const [userWayReady, setUserWayReady] = useState(Boolean(window.__pecutUserWay));

    useEffect(() => {
        const handleReady = () => setUserWayReady(true);

        window.addEventListener("pecut:userway-ready", handleReady);

        return () => {
            window.removeEventListener("pecut:userway-ready", handleReady);
        };
    }, []);

    const openUserWay = () => {
        const instance = window.__pecutUserWay || window.UserWay;

        if (instance?.widgetOpen) {
            instance.widgetOpen();
            return;
        }

        // Jika widget masih sedang diunduh, buka otomatis setelah event init diterima.
        window.__pecutUserWayOpenRequested = true;
    };

    return (
        <nav
            className="fixed right-5 bottom-5 z-[120] flex items-center gap-3 sm:right-6 sm:bottom-6"
            aria-label="Akses cepat PECUT"
        >
            <CircleLink
                href="/help"
                label="Bantuan PECUT"
                className="theme-bg-primary text-white hover:bg-[color-mix(in_srgb,var(--theme-primary),black_12%)] hover:text-white"
            >
                <CircleHelp className="h-5 w-5" strokeWidth={2.25} />
            </CircleLink>

            <CircleLink
                href={LAPOR_MBAK_WALI_URL}
                external
                label="Lapor Mbak Wali"
                className="theme-bg-primary text-white hover:bg-[color-mix(in_srgb,var(--theme-primary),black_12%)]"
            >
                <MessagesSquare className="h-5 w-5" strokeWidth={2.25} />
            </CircleLink>

            <CircleButton
                label="Menu Aksesibilitas"
                onClick={openUserWay}
                className="overflow-hidden theme-bg-primary p-1 text-white hover:bg-[color-mix(in_srgb,var(--theme-primary),black_12%)]"
            >
                <Accessibility className="h-5 w-5" strokeWidth={2.25} />

                {!userWayReady ? (
                    <span className="absolute inset-0 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                ) : null}
            </CircleButton>
        </nav>
    );
}
