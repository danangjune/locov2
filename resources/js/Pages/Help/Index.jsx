import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { ChevronDown, HelpCircle, Mail, MapPinned, Phone } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import PageHero from "../../Components/UI/PageHero";
import { DynamicIcon } from "../../Utils/iconRegistry";

const iconMap = {
    Mail,
    Phone,
    MapPinned,
};

const fallbackFooter = {
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

export default function Index({ meta = {}, data = {} }) {
    const { props } = usePage();
    
    const footer = props?.footer || fallbackFooter;

    const groups =
        Array.isArray(footer?.groups) && footer.groups.length
            ? footer.groups
            : fallbackFooter.groups;

    const findGroups =
        groups.find(
            (group) =>
                group.title?.trim().toLowerCase() === "hubungi kami" || group.title?.trim().toLowerCase() === "kontak"
        ) || null;

    const faqs = Array.isArray(data?.faqs) ? data.faqs : [];
    const contacts = findGroups.children || [];
    const quickLinks = Array.isArray(data?.quick_links) ? data.quick_links : [];

    return (
        <>
            <Head title={meta?.title || "Pusat Bantuan"} />

            <PublicLayout currentRoute="help">
                <PageShell>
                    <PageHero
                        eyebrow="Bantuan"
                        title="Pusat Bantuan PECUT"
                        subtitle="Halaman bantuan untuk kontak, pertanyaan umum, dan informasi dukungan pengguna portal PECUT."
                        icon={HelpCircle}
                    />

                    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
                        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                            <h2 className="text-2xl font-black text-slate-900">Pertanyaan Umum</h2>
                            <p className="mt-2 text-sm leading-7 text-slate-500">Beberapa pertanyaan yang sering muncul terkait penggunaan PECUT.</p>

                            <div className="mt-6 space-y-4">
                                {faqs.map((item) => (
                                    <details key={item.question} className="group rounded-3xl bg-slate-50 p-5">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-900">
                                            {item.question}
                                            <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                                        </summary>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-blue-700 p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                                <h2 className="text-2xl font-black">Kontak Bantuan</h2>
                                <p className="mt-3 text-sm leading-7 text-sky-50">Gunakan kontak berikut untuk kebutuhan informasi atau dukungan penggunaan layanan.</p>

                                <div className="mt-6 space-y-4">
                                    {contacts.map((item) => {
                                        const label = item?.label || item?.content || item?.title || "-";
                                        const url = item?.url || "";
                                    
                                        return (
                                            <SmartLink
                                                href={url}
                                                title={label}
                                                className={[
                                                    "group flex items-start gap-3 rounded-3xl bg-white/15 p-4 backdrop-blur",
                                                ].join(" ")}
                                            >
                                                <DynamicIcon name={item.icon}  className="h-5 w-5 text-amber-200" />
                                                <div>
                                                    <p className="text-xs font-bold text-sky-100">{label}</p>
                                                </div>
                                            </SmartLink>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                <h3 className="text-lg font-black text-slate-950">Akses Cepat</h3>
                                <div className="mt-4 grid gap-3">
                                    {quickLinks.map((item) => (
                                        <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black text-sky-700 hover:border-sky-200 hover:bg-sky-50">
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
