import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FileUp, Palette, RotateCcw, Save, Upload, X } from "lucide-react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { alertError, alertSuccess, confirmAction, confirmUpdate } from "../../../Utils/swal";

function sanitizeSvgPreview(svg = "") {
    return String(svg || "")
        .replace(/<\?xml.*?\?>/gis, "")
        .replace(/<!doctype.*?>/gis, "")
        .replace(/<script\b[^>]*>.*?<\/script>/gis, "")
        .replace(/<foreignObject\b[^>]*>.*?<\/foreignObject>/gis, "")
        .replace(/<iframe\b[^>]*>.*?<\/iframe>/gis, "")
        .replace(/<object\b[^>]*>.*?<\/object>/gis, "")
        .replace(/<embed\b[^>]*>.*?<\/embed>/gis, "")
        .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/(href|xlink:href)\s*=\s*("|')\s*javascript:[^"']*("|')/gi, '$1="#"');
}

function LogoThemeStyle({ scopeId }) {
    return (
        <style>{`
            #${scopeId}.logo-preview-svg svg {
                display: block;
                width: 100%;
                height: 100%;
                max-width: 100%;
            }

            #${scopeId}.logo-preview-svg .cls-1,
            #${scopeId}.logo-preview-svg [fill="#2da8fe" i],
            #${scopeId}.logo-preview-svg [fill="#29a8ff" i] {
                fill: var(--logo-primary) !important;
            }

            #${scopeId}.logo-preview-svg .cls-2,
            #${scopeId}.logo-preview-svg .cls-3,
            #${scopeId}.logo-preview-svg text,
            #${scopeId}.logo-preview-svg [fill="#0158b1" i],
            #${scopeId}.logo-preview-svg [fill="#0058b1" i] {
                fill: var(--logo-secondary) !important;
            }

            #${scopeId}.logo-preview-svg .logo-accent,
            #${scopeId}.logo-preview-svg .cls-accent,
            #${scopeId}.logo-preview-svg [data-logo-color="accent"] {
                fill: var(--logo-accent) !important;
            }

            #${scopeId}.logo-preview-svg [data-logo-color="text"] {
                fill: var(--logo-text) !important;
            }
        `}</style>
    );
}

function LogoPreview({ svg, title, description, dark = false, colors }) {
    const scopeId = useMemo(
        () => `logo-preview-${Math.random().toString(36).slice(2)}`,
        []
    );

    return (
        <div className={["rounded-3xl border p-5", dark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"].join(" ")}>
            <div className="mb-5">
                <h3 className={["text-sm font-black", dark ? "text-white" : "text-slate-900"].join(" ")}>{title}</h3>
                <p className={["mt-1 text-xs leading-5", dark ? "text-slate-400" : "text-slate-500"].join(" ")}>{description}</p>
            </div>

            <div className={["grid min-h-28 place-items-center rounded-3xl p-6 ring-1", dark ? "bg-slate-900 ring-slate-800" : "bg-slate-50 ring-slate-100"].join(" ")}>
                {svg ? (
                    <>
                        <span
                            id={scopeId}
                            className="logo-preview-svg inline-flex h-16 w-full max-w-[300px] items-center justify-center"
                            style={{
                                "--logo-primary": colors.primary,
                                "--logo-secondary": colors.secondary,
                                "--logo-accent": colors.accent,
                                "--logo-text": colors.text,
                            }}
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                        <LogoThemeStyle scopeId={scopeId} />
                    </>
                ) : (
                    <div className="text-center">
                        <FileUp className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-xs font-bold text-slate-400">Upload SVG terlebih dahulu</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ColorField({ label, value, onChange, disabled = false, help = "" }) {
    return (
        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
            <div className="mt-3 flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-11 w-14 rounded-xl border border-slate-200 bg-white p-1 disabled:opacity-50"
                />
                <input
                    value={value}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-sky-300 disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder="#1e6fa5"
                />
            </div>
            {help ? <p className="mt-2 text-xs leading-5 text-slate-400">{help}</p> : null}
        </label>
    );
}

function UploadSvgBox({ value, currentSvg, error, onChange, onRemove }) {
    const inputRef = useRef(null);
    const hasLogo = Boolean(value || currentSvg);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-black text-slate-950">Logo SVG Utama</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Upload logo dalam format SVG agar warna bisa disesuaikan dengan tema portal.
                    </p>
                    <p className="mt-2 text-xs font-bold text-slate-400">
                        Wajib SVG. Rekomendasi: vector clean, transparan, ukuran maksimal 2MB.
                    </p>
                </div>

                {hasLogo ? (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100"
                        title="Hapus logo SVG"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : null}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/svg+xml,.svg"
                className="hidden"
                onChange={(event) => onChange(event.target.files?.[0] || null)}
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white hover:bg-sky-700"
            >
                <Upload className="h-4 w-4" /> Upload Logo SVG
            </button>

            {value instanceof File ? (
                <p className="mt-3 rounded-2xl bg-sky-50 px-4 py-3 text-xs font-bold text-sky-700">
                    File dipilih: {value.name}
                </p>
            ) : null}

            {error ? <p className="mt-2 text-xs font-bold text-rose-600">{error}</p> : null}
        </div>
    );
}

export default function Index({ meta = {}, data = {} }) {
    const { props } = usePage();
    const setting = data?.setting || {};
    const defaults = data?.defaults || {};
    const theme = props?.theme || {};

    const form = useForm({
        app_name: setting?.app_name || "PECUT",
        alt_text: setting?.alt_text || "PECUT Kota Kediri",
        logo_svg: null,
        favicon: null,
        logo_primary_color: setting?.logo_primary_color || defaults?.primary || "#2da8fe",
        logo_secondary_color: setting?.logo_secondary_color || defaults?.secondary || "#0158b1",
        logo_accent_color: setting?.logo_accent_color || defaults?.accent || "#38bdf8",
        logo_text_color: setting?.logo_text_color || defaults?.text || "#0158b1",
        use_theme_colors: Boolean(setting?.use_theme_colors ?? true),
        remove_logo_svg: false,
        remove_favicon: false,
    });

    const [previewSvg, setPreviewSvg] = useState(setting?.logo_svg_inline || "");

    useEffect(() => {
        if (!(form.data.logo_svg instanceof File)) {
            setPreviewSvg(setting?.logo_svg_inline || "");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewSvg(sanitizeSvgPreview(event.target?.result || ""));
        };
        reader.readAsText(form.data.logo_svg);
    }, [form.data.logo_svg, setting?.logo_svg_inline]);

    const themeColorData = theme?.colors || {};

    const themeColors = {
        primary: themeColorData?.primary_color || "var(--theme-primary)",
        secondary: themeColorData?.secondary_color || "var(--theme-secondary)",
        accent: themeColorData?.accent_color || "var(--theme-accent)",
        text: themeColorData?.text_color || "var(--theme-text)",
    };

    const previewColors = form.data.use_theme_colors
        ? themeColors
        : {
              primary: form.data.logo_primary_color,
              secondary: form.data.logo_secondary_color,
              accent: form.data.logo_accent_color,
              text: form.data.logo_text_color,
          };

    const applyThemeColors = () => {
        form.setData({
            ...form.data,
            logo_primary_color: themeColorData?.primary_color || form.data.logo_primary_color,
            logo_secondary_color: themeColorData?.secondary_color || form.data.logo_secondary_color,
            logo_accent_color: themeColorData?.accent_color || form.data.logo_accent_color,
            logo_text_color: themeColorData?.text_color || form.data.logo_text_color,
        });
    };

    const submit = async (event) => {
        event.preventDefault();

        const result = await confirmUpdate({
            title: "Perbarui Logo SVG Portal?",
            text: "Logo dan pengaturan warna akan digunakan pada header dan footer portal.",
            confirmButtonText: "Ya, Perbarui",
        });

        if (!result.isConfirmed) return;

        form.post("/admin/logo-setting", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => alertSuccess({ title: "Logo Diperbarui", text: "Logo SVG portal berhasil diperbarui." }),
            onError: () => alertError({ title: "Gagal Memperbarui", text: "Periksa kembali file SVG dan warna logo." }),
        });
    };

    const resetLogo = async () => {
        const result = await confirmAction({
            icon: "warning",
            title: "Reset Logo Portal?",
            text: "Logo SVG custom dan warna logo akan dikembalikan ke default.",
            confirmButtonText: "Ya, Reset",
        });

        if (!result.isConfirmed) return;

        router.post("/admin/logo-setting/reset", {}, {
            preserveScroll: true,
            onSuccess: () => alertSuccess({ title: "Logo Direset", text: "Logo portal berhasil dikembalikan ke default." }),
            onError: () => alertError({ title: "Gagal Reset", text: "Logo gagal dikembalikan ke default." }),
        });
    };

    return (
        <AdminLayout title={meta?.title || "Logo Portal"}>
            <Head title={meta?.title || "Logo Portal"} />

            <div className="space-y-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-blue-700 p-6 text-white shadow-xl shadow-sky-100">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-100">Branding Portal</p>
                    <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-3xl font-black">Logo Portal SVG</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-sky-50">
                                Upload logo SVG dan sesuaikan warnanya dengan template portal. Preview akan langsung berubah sebelum disimpan.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={resetLogo}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-black text-white ring-1 ring-white/20 hover:bg-white/20"
                        >
                            <RotateCcw className="h-4 w-4" /> Reset Default
                        </button>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Portal</span>
                            <input
                                value={form.data.app_name}
                                onChange={(event) => form.setData("app_name", event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-sky-300"
                                placeholder="PECUT"
                            />
                            {form.errors.app_name ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.app_name}</p> : null}
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Alt Text Logo</span>
                            <input
                                value={form.data.alt_text}
                                onChange={(event) => form.setData("alt_text", event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-sky-300"
                                placeholder="PECUT Kota Kediri"
                            />
                            {form.errors.alt_text ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.alt_text}</p> : null}
                        </label>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                        <div className="space-y-5">
                            <UploadSvgBox
                                value={form.data.logo_svg}
                                currentSvg={setting?.logo_svg_inline}
                                error={form.errors.logo_svg}
                                onChange={(file) => {
                                    form.setData("logo_svg", file);
                                    form.setData("remove_logo_svg", false);
                                }}
                                onRemove={() => {
                                    form.setData("logo_svg", null);
                                    form.setData("remove_logo_svg", true);
                                    setPreviewSvg("");
                                }}
                            />

                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                                        <Palette className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h3 className="text-base font-black text-slate-950">Mode Warna Logo</h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Pilih apakah logo mengikuti warna tema portal atau memakai warna khusus logo.
                                        </p>
                                    </div>
                                </div>

                                <label className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                                    <span>
                                        <span className="block text-sm font-black text-slate-800">Ikuti warna tema portal</span>
                                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                                            Jika aktif, logo otomatis berubah ketika tema portal diganti.
                                        </span>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={form.data.use_theme_colors}
                                        onChange={(event) => form.setData("use_theme_colors", event.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={applyThemeColors}
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                                >
                                    Ambil Warna dari Tema Saat Ini
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <ColorField
                                    label="Warna Utama"
                                    value={form.data.logo_primary_color}
                                    disabled={form.data.use_theme_colors}
                                    onChange={(value) => form.setData("logo_primary_color", value)}
                                    help="Biasanya untuk aksen biru muda / bagian motif."
                                />
                                <ColorField
                                    label="Warna Sekunder"
                                    value={form.data.logo_secondary_color}
                                    disabled={form.data.use_theme_colors}
                                    onChange={(value) => form.setData("logo_secondary_color", value)}
                                    help="Biasanya untuk teks utama/logo gelap."
                                />
                                <ColorField
                                    label="Warna Aksen"
                                    value={form.data.logo_accent_color}
                                    disabled={form.data.use_theme_colors}
                                    onChange={(value) => form.setData("logo_accent_color", value)}
                                    help="Opsional untuk SVG yang memakai class aksen."
                                />
                                <ColorField
                                    label="Warna Teks"
                                    value={form.data.logo_text_color}
                                    disabled={form.data.use_theme_colors}
                                    onChange={(value) => form.setData("logo_text_color", value)}
                                    help="Opsional untuk SVG yang memakai data-logo-color='text'."
                                />
                            </div>

                            <div className="grid gap-5 lg:grid-cols-2">
                                <LogoPreview
                                    svg={previewSvg}
                                    title="Preview Header"
                                    description="Simulasi logo pada background terang."
                                    colors={previewColors}
                                />
                                <LogoPreview
                                    svg={previewSvg}
                                    title="Preview Footer"
                                    description="Simulasi logo pada background gelap."
                                    dark
                                    colors={previewColors}
                                />
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-base font-black text-slate-950">Cara SVG Dibaca</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-500">
                                    Sistem otomatis memetakan <b>.cls-1</b> sebagai warna utama dan <b>.cls-2/.cls-3</b> sebagai warna sekunder.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-4 z-10 flex justify-end">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-100 hover:bg-sky-700 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" /> {form.processing ? "Menyimpan..." : "Simpan Logo SVG"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
