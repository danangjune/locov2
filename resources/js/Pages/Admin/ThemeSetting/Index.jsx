import React, { useMemo } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import { Check, Palette, RotateCcw, Save, Sparkles } from "lucide-react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { alertError, alertSuccess, confirmSave, confirmUpdate } from "../../../Utils/swal";

const colorFields = [
    {
        key: "primary_color",
        label: "Warna Utama",
        desc: "Tombol utama, link aktif, tab aktif, dan highlight utama.",
    },
    {
        key: "secondary_color",
        label: "Warna Sekunder",
        desc: "Hover utama, header tertentu, dan warna pendukung.",
    },
    {
        key: "accent_color",
        label: "Warna Aksen",
        desc: "Garis, badge lembut, dekorasi, dan elemen kecil.",
    },
    {
        key: "background_color",
        label: "Background Halaman",
        desc: "Latar halaman publik dan panel lembut.",
    },
    {
        key: "surface_color",
        label: "Surface / Card",
        desc: "Warna dasar card, panel, dan container.",
    },
    {
        key: "text_color",
        label: "Teks Utama",
        desc: "Judul dan teks utama.",
    },
    {
        key: "muted_text_color",
        label: "Teks Sekunder",
        desc: "Subtitle, deskripsi, dan teks penjelas.",
    },
];

function isValidHex(value) {
    return /^#[0-9A-Fa-f]{6}$/.test(String(value || ""));
}

function ColorInput({ field, value, error, onChange }) {
    const valid = isValidHex(value);

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
                <label className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                    <input
                        type="color"
                        value={valid ? value : "#000000"}
                        onChange={(event) => onChange(event.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="block h-full w-full" style={{ backgroundColor: valid ? value : "#000000" }} />
                </label>

                <div className="min-w-0 flex-1">
                    <label className="block text-sm font-black text-slate-900">{field.label}</label>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">{field.desc}</p>

                    <input
                        value={value || ""}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder="#1E6FA5"
                        className={`mt-3 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm font-black uppercase tracking-wide text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white ${
                            error ? "border-rose-300" : valid ? "border-slate-200" : "border-amber-300"
                        }`}
                    />

                    {error ? <p className="mt-2 text-xs font-bold text-rose-600">{error}</p> : null}
                    {!error && !valid ? <p className="mt-2 text-xs font-bold text-amber-600">Format warna harus seperti #1E6FA5.</p> : null}
                </div>
            </div>
        </div>
    );
}

function ThemePreview({ data }) {
    const style = {
        "--preview-primary": data.primary_color,
        "--preview-secondary": data.secondary_color,
        "--preview-accent": data.accent_color,
        "--preview-background": data.background_color,
        "--preview-surface": data.surface_color,
        "--preview-text": data.text_color,
        "--preview-muted": data.muted_text_color,
    };

    return (
        <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/60" style={style}>
            <div className="p-5">
                <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ backgroundColor: "var(--preview-primary)" }}>
                        <Palette className="h-6 w-6" />
                    </span>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--preview-primary)" }}>
                            Preview Tema
                        </p>
                        <h3 className="text-xl font-black" style={{ color: "var(--preview-text)" }}>
                            {data.name || "Tema PECUT"}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="p-5" style={{ backgroundColor: "var(--preview-background)" }}>
                <div className="rounded-3xl p-5 shadow-sm" style={{ backgroundColor: "var(--preview-surface)" }}>
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--preview-primary)" }}>
                        Portal PECUT
                    </p>
                    <h4 className="mt-2 text-2xl font-black" style={{ color: "var(--preview-text)" }}>
                        Layanan Digital Kota Kediri
                    </h4>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--preview-muted)" }}>
                        Contoh tampilan tombol, card, teks, dan aksen setelah tema diterapkan.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="rounded-2xl px-4 py-3 text-sm font-black text-white shadow-lg"
                            style={{ backgroundColor: "var(--preview-primary)" }}
                        >
                            Tombol Utama
                        </button>
                        <button
                            type="button"
                            className="rounded-2xl border px-4 py-3 text-sm font-black"
                            style={{
                                borderColor: "color-mix(in srgb, var(--preview-primary), white 60%)",
                                backgroundColor: "color-mix(in srgb, var(--preview-primary), white 92%)",
                                color: "var(--preview-primary)",
                            }}
                        >
                            Tombol Outline
                        </button>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                        {[data.primary_color, data.secondary_color, data.accent_color].map((color) => (
                            <div key={color} className="h-16 rounded-2xl" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Index({ meta = {}, data: pageData = {} }) {
    const setting = pageData?.setting || {};
    const defaults = pageData?.defaults || {};
    const examples = Array.isArray(pageData?.examples) ? pageData.examples : [];

    const form = useForm({
        name: setting.name || "Tema PECUT",
        primary_color: setting.primary_color || defaults.primary_color || "#1E6FA5",
        secondary_color: setting.secondary_color || defaults.secondary_color || "#15547D",
        accent_color: setting.accent_color || defaults.accent_color || "#38BDF8",
        background_color: setting.background_color || defaults.background_color || "#F8FAFC",
        surface_color: setting.surface_color || defaults.surface_color || "#FFFFFF",
        text_color: setting.text_color || defaults.text_color || "#0F172A",
        muted_text_color: setting.muted_text_color || defaults.muted_text_color || "#64748B",
    });

    const allValid = useMemo(() => colorFields.every((field) => isValidHex(form.data[field.key])), [form.data]);

    const applyPreset = (preset) => {
        form.setData((current) => ({
            ...current,
            name: preset.name || current.name,
            primary_color: preset.primary_color || current.primary_color,
            secondary_color: preset.secondary_color || current.secondary_color,
            accent_color: preset.accent_color || current.accent_color,
        }));
    };

    const submit = async (event) => {
        event.preventDefault();

        const result = await confirmUpdate({
            title: "Simpan Tema Portal?",
            text: "Perubahan warna akan diterapkan ke halaman yang sudah memakai token tema.",
            confirmButtonText: "Ya, Simpan Tema",
        });

        if (!result.isConfirmed) return;

        form.put("/admin/theme-setting", {
            preserveScroll: true,
            onSuccess: () => alertSuccess({ title: "Tema Disimpan", text: "Tema portal berhasil diperbarui." }),
            onError: () => alertError({ title: "Gagal Menyimpan", text: "Periksa kembali format warna yang dimasukkan." }),
        });
    };

    const resetTheme = async () => {
        const result = await confirmSave({
            title: "Reset Tema?",
            text: "Tema akan dikembalikan ke warna default PECUT.",
            confirmButtonText: "Ya, Reset",
        });

        if (!result.isConfirmed) return;

        router.post(
            "/admin/theme-setting/reset",
            {},
            {
                preserveScroll: true,
                onSuccess: () => alertSuccess({ title: "Tema Direset", text: "Tema portal kembali ke default." }),
                onError: () => alertError({ title: "Gagal Reset", text: "Terjadi kesalahan saat reset tema." }),
            },
        );
    };

    return (
        <>
            <Head title={meta?.title || "Tampilan Portal"} />

            <AdminLayout
                title="Tampilan Portal"
                subtitle="Atur warna identitas portal dari satu tempat agar tampilan publik dan admin lebih konsisten."
                actions={
                    <button
                        type="button"
                        onClick={resetTheme}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm hover:bg-slate-50"
                    >
                        <RotateCcw className="h-4 w-4" /> Reset
                    </button>
                }
            >
                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
                    <div className="space-y-6">
                        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                                    <Sparkles className="h-6 w-6" />
                                </span>
                                <div>
                                    <h3 className="text-xl font-black text-slate-950">Konfigurasi Tema</h3>
                                    <p className="mt-1 text-sm font-semibold text-slate-400">Gunakan format warna HEX, contoh #1E6FA5.</p>
                                </div>
                            </div>

                            <label className="mt-5 block">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Tema</span>
                                <input
                                    value={form.data.name}
                                    onChange={(event) => form.setData("name", event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
                                />
                                {form.errors.name ? <p className="mt-2 text-xs font-bold text-rose-600">{form.errors.name}</p> : null}
                            </label>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {colorFields.map((field) => (
                                <ColorInput
                                    key={field.key}
                                    field={field}
                                    value={form.data[field.key]}
                                    error={form.errors[field.key]}
                                    onChange={(value) => form.setData(field.key, value)}
                                />
                            ))}
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-black text-slate-950">Preset Cepat</h3>
                            <p className="mt-1 text-sm font-semibold text-slate-400">Pilih contoh kombinasi warna, lalu tetap bisa disesuaikan manual.</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {examples.map((preset) => (
                                    <button
                                        type="button"
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                                    >
                                        <div className="flex gap-1">
                                            {[preset.primary_color, preset.secondary_color, preset.accent_color].map((color) => (
                                                <span key={color} className="h-8 flex-1 rounded-xl" style={{ backgroundColor: color }} />
                                            ))}
                                        </div>
                                        <p className="mt-3 text-sm font-black text-slate-800">{preset.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={resetTheme}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                            >
                                <RotateCcw className="h-4 w-4" /> Reset Default
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing || !allValid}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {form.processing ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                {form.processing ? "Menyimpan..." : "Simpan Tema"}
                            </button>
                        </div>
                    </div>

                    <ThemePreview data={form.data} />
                </form>
            </AdminLayout>
        </>
    );
}
