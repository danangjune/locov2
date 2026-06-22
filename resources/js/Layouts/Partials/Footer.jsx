import { Link, usePage } from "@inertiajs/react";
import { ExternalLink } from "lucide-react";
import { DynamicIcon } from "../../Utils/iconRegistry";
import BrandLogo from "../../Components/Brand/BrandLogo";

const fallbackFooter = {
    logo: "/images/logo-pecut-full-transparan.png",
    description:
        "PECUT adalah portal layanan digital Pemerintah Kota Kediri untuk memudahkan masyarakat, ASN, dan perangkat daerah menemukan layanan digital dalam satu pintu.",
    copyright:
        "© 2026 PECUT Kota Kediri. Portal layanan digital satu pintu Pemerintah Kota Kediri.",
    bottom_text: "PECUT · Portal Efisien Cepat Mudah Terpadu",
    groups: [],
};

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

function isHttpUrl(url = "") {
    return url.startsWith("http://") || url.startsWith("https://");
}

function SmartLink({ href = "", children, className = "", title = "" }) {
    if (!href) {
        return (
            <div className={className} title={title}>
                {children}
            </div>
        );
    }

    if (isExternalUrl(href)) {
        return (
            <a
                href={href}
                target={isHttpUrl(href) ? "_blank" : undefined}
                rel={isHttpUrl(href) ? "noreferrer" : undefined}
                className={className}
                title={title}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className} title={title}>
            {children}
        </Link>
    );
}

function FooterImageItem({ item }) {
    const label = item?.label || item?.content || item?.title || "Footer Image";
    const url = item?.url || "";

    return (
        <SmartLink
            href={url}
            title={label}
            className={[
                "group block overflow-hidden rounded-2xl bg-white/5 transition",
                url ? "hover:bg-white/10" : "",
            ].join(" ")}
        >
            <div className="relative grid h-16 place-items-center overflow-hidden rounded-xl theme-bg-muted">
                <img
                    src={item.image}
                    alt={label}
                    className="max-h-11 max-w-full object-contain transition duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
        </SmartLink>
    );
}

function FooterTextItem({ item }) {
    const label = item?.label || item?.content || item?.title || "-";
    const url = item?.url || "";

    return (
        <SmartLink
            href={url}
            title={label}
            className={[
                "group flex w-fit max-w-full items-center gap-2 text-sm leading-6 theme-footer-muted transition",
                url ? "hover:text-white" : "",
            ].join(" ")}
        >
            {item?.icon && (
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full theme-bg-accent-soft-token theme-footer-link">
                    <DynamicIcon name={item.icon} className="h-3.5 w-3.5" />
                </span>
            )}

            <span className="min-w-0 break-words">{label}</span>
        </SmartLink>
    );
}

function FooterGroup({ group }) {
    const children = Array.isArray(group?.children) ? group.children : [];
    const imageChildren = children.filter((item) => item?.image);
    const textChildren = children.filter((item) => !item?.image);

    return (
        <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white">
                {group?.title || group?.content || "Footer"}
            </h4>

            <div className="mt-4 h-1 w-9 rounded-full theme-bg-accent" />

            <div className="mt-6 space-y-5">
                {imageChildren.length ? (
                    <div className="grid grid-cols-1 gap-3">
                        {imageChildren.map((item) => (
                            <FooterImageItem key={item.id} item={item} />
                        ))}
                    </div>
                ) : null}

                {textChildren.length ? (
                    <div className="space-y-3">
                        {textChildren.map((item) => (
                            <FooterTextItem key={item.id} item={item} />
                        ))}
                    </div>
                ) : null}

                {!children.length && group?.image ? (
                    <FooterImageItem
                        item={{
                            id: group.id,
                            label: group.title || group.content,
                            url: group.url,
                            image: group.image,
                        }}
                    />
                ) : null}

                {!children.length && !group?.image && group?.url ? (
                    <FooterTextItem
                        item={{
                            id: group.id,
                            label: group.title || group.content,
                            url: group.url,
                            icon: group.icon,
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default function Footer() {
    const { props } = usePage();

    const footer = props?.footer || fallbackFooter;

    const groups =
        Array.isArray(footer?.groups) && footer.groups.length
            ? footer.groups
            : fallbackFooter.groups;

    const logo = footer?.logo || fallbackFooter.logo;
    const description = footer?.description || fallbackFooter.description;
    const copyright = footer?.copyright || fallbackFooter.copyright;
    const bottomText = footer?.bottom_text || fallbackFooter.bottom_text;

    return (
        <footer className="relative overflow-hidden theme-footer text-white">
            <div className="absolute inset-x-0 top-0 h-px theme-footer-top-line" />

            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full theme-bg-primary blur-3xl" />
            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full theme-bg-primary blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex rounded-xl bg-white px-3 py-1 shadow-xl shadow-sky-950/20"
                            aria-label="Kembali ke Beranda PECUT"
                        >
                            <BrandLogo
                                variant="footer"
                                mode="dynamic"
                                className="h-12 w-auto"
                            />
                        </Link>

                        <p className="mt-7 text-sm leading-8 theme-footer-muted">
                            {description}
                        </p>
                    </div>

                    {groups.length ? (
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {groups.map((group) => (
                                <FooterGroup key={group.id} group={group} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="relative border-t border-white/10 bg-slate-950/80">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs font-semibold text-slate-400 sm:flex-row sm:px-6 lg:px-8">
                    <p>{copyright}</p>
                    <p className="theme-footer-link">{bottomText}</p>
                </div>
            </div>
        </footer>
    );
}
