import React, { useMemo } from "react";
import { usePage } from "@inertiajs/react";

const FALLBACKS = {
    header: "/images/logo-pecut-full.png",
    footer: "/images/logo-pecut-full.png",
    icon: "/images/logo-pecut-icon.png",
};

function withVersion(url, version) {
    if (!url || !version) return url;
    if (url.startsWith("data:")) return url;

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${version}`;
}

function LogoSvgThemeStyle({ scopeId }) {
    return (
        <style>{`
            #${scopeId}.brand-logo-svg svg {
                display: block;
                width: 100%;
                height: 100%;
                max-width: 100%;
            }

            #${scopeId}.brand-logo-svg .cls-1,
            #${scopeId}.brand-logo-svg [fill="#2da8fe" i],
            #${scopeId}.brand-logo-svg [fill="#29a8ff" i],
            #${scopeId}.brand-logo-svg [fill="#2DA8FE" i] {
                fill: var(--logo-primary) !important;
            }

            #${scopeId}.brand-logo-svg .cls-2,
            #${scopeId}.brand-logo-svg text,
            #${scopeId}.brand-logo-svg [fill="#0158b1" i],
            #${scopeId}.brand-logo-svg [fill="#0058b1" i],
            #${scopeId}.brand-logo-svg [fill="#0158B1" i] {
                fill: var(--logo-secondary) !important;
            }

            #${scopeId}.brand-logo-svg .cls-3,
            #${scopeId}.brand-logo-svg .logo-accent,
            #${scopeId}.brand-logo-svg .cls-accent,
            #${scopeId}.brand-logo-svg [data-logo-color="accent"] {
                fill: var(--logo-accent) !important;
            }

            #${scopeId}.brand-logo-svg [data-logo-color="text"] {
                fill: var(--logo-text) !important;
            }
        `}</style>
    );
}

function SvgLogo({ svg, alt, className, colors, mono = false }) {
    const scopeId = useMemo(
        () => `brand-logo-${Math.random().toString(36).slice(2)}`,
        []
    );

    const style = mono
        ? {
              "--logo-primary": "currentColor",
              "--logo-secondary": "currentColor",
              "--logo-accent": "currentColor",
              "--logo-text": "currentColor",
          }
        : {
              "--logo-primary": colors?.primary || "var(--theme-primary)",
              "--logo-secondary": colors?.secondary || "var(--theme-secondary)",
              "--logo-accent": colors?.accent || "var(--theme-accent)",
              "--logo-text": colors?.text || colors?.secondary || "var(--theme-secondary)",
          };

    return (
        <>
            <span
                id={scopeId}
                className={["brand-logo-svg inline-flex", className].join(" ")}
                style={style}
                role="img"
                aria-label={alt}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
            <LogoSvgThemeStyle scopeId={scopeId} />
        </>
    );
}

export default function BrandLogo({
    variant = "header",
    className = "h-11 w-auto",
    imgClassName = "h-full w-auto object-contain",
    fallback = null,
    mode = "dynamic", // dynamic | original | mono
}) {
    const { props } = usePage();
    const brandLogo = props?.brandLogo || {};

    const version = brandLogo?.updated_at;
    const alt = brandLogo?.alt_text || brandLogo?.app_name || "PECUT Kota Kediri";

    if (mode !== "original" && brandLogo?.logo_svg_inline) {
        return (
            <>
                <SvgLogo
                    svg={brandLogo.logo_svg_inline}
                    alt={alt}
                    className={className}
                    colors={brandLogo?.colors}
                    mono={mode === "mono"}
                />
            </>
        );
    }

    const srcMap = {
        header: brandLogo?.header_logo || FALLBACKS.header,
        footer: brandLogo?.footer_logo || brandLogo?.header_logo || FALLBACKS.footer,
        icon: brandLogo?.icon_logo || FALLBACKS.icon,
    };

    const src = srcMap[variant] || srcMap.header || fallback;

    if (!src) return null;

    return (
        <span className={className} aria-label={alt}>
            <img
                src={withVersion(src, version)}
                alt={alt}
                className={imgClassName}
                loading="eager"
                draggable="false"
                onError={(event) => {
                    if (fallback && event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                        return;
                    }

                    event.currentTarget.style.display = "none";
                }}
            />
        </span>
    );
}
