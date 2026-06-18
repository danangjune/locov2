import React, { useMemo, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import SearchableSelect from "../../../../Components/Form/SearchableSelect";
import IconPicker from "../../../../Components/Form/IconPicker";

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-2 text-sm font-bold text-rose-600">{message}</p>;
}

function TextInput({
    label,
    value,
    onChange,
    error,
    placeholder,
    type = "text",
}) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                {label}
            </label>
            <input
                type={type}
                value={value || ""}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            />
            <FieldError message={error} />
        </div>
    );
}

export default function AppForm({
    mode = "create",
    app = null,
    parent = null,
    options = {},
    parentOptions = [],
    defaults = {},
}) {
    const isEdit = mode === "edit";
    const [preview, setPreview] = useState(app?.image_url || null);

    const initialParent = app?.parent ?? defaults?.parent ?? 0;

    const { data, setData, post, processing, errors } = useForm({
        parent: initialParent,
        urusan_id: app?.urusan_id ?? defaults?.urusan_id ?? "",
        category_id: app?.category_id ?? defaults?.category_id ?? "",
        app_from_id: app?.app_from_id ?? defaults?.app_from_id ?? 1,
        name: app?.name ?? "",
        alias: app?.alias ?? "",
        description: app?.description ?? "",
        url: app?.url ?? "",
        icon: app?.icon ?? "",
        image: null,
        is_active: app?.is_active ?? defaults?.is_active ?? true,
        is_sso: app?.is_sso ?? defaults?.is_sso ?? false,
        is_popular: app?.is_popular ?? defaults?.is_popular ?? false,
        _method: isEdit ? "PUT" : "",
    });

    const parentList = useMemo(() => {
        return [
            {
                id: 0,
                name: "Root / Tidak punya parent",
                category: "",
                urusan: "",
            },
            ...(parentOptions || []),
        ];
    }, [parentOptions]);

    const onImageChange = (file) => {
        setData("image", file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (event) => {
        event.preventDefault();

        if (isEdit) {
            post(`/admin/apps/${app.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }

        post("/admin/apps", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                            Informasi Aplikasi
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-slate-950">
                            {isEdit
                                ? "Edit Data Aplikasi"
                                : "Tambah Data Aplikasi"}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Lengkapi informasi utama aplikasi. Jika membuat
                            child, pilih parent sesuai struktur OPD atau unit
                            layanan.
                        </p>
                    </div>
                    <Link
                        href="/admin/apps"
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                </div>

                {parent && !isEdit && (
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                        <p className="text-xs font-black uppercase tracking-widest text-sky-700">
                            Child dari
                        </p>
                        <p className="mt-1 text-base font-black text-slate-900">
                            {parent.name}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            {parent.category?.title || "-"} •{" "}
                            {parent.urusan?.title || "-"}
                        </p>
                    </div>
                )}

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <SearchableSelect
                        label="Parent"
                        value={data.parent ?? 0}
                        onChange={(value) =>
                            setData("parent", Number(value || 0))
                        }
                        options={parentList}
                        error={errors.parent}
                        placeholder="Pilih parent"
                        searchPlaceholder="Cari parent aplikasi..."
                        emptyText="Parent tidak ditemukan"
                        clearable={false}
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) =>
                            `${item.name}${item.urusan ? ` — ${item.urusan}` : ""}`
                        }
                        getSearchText={(item) =>
                            [item.name, item.urusan, item.category]
                                .filter(Boolean)
                                .join(" ")
                        }
                        isOptionDisabled={(item) =>
                            isEdit && Number(item.id) === Number(app?.id)
                        }
                        renderSelected={(item) => (
                            <span className="block min-w-0">
                                <span className="block truncate font-black text-slate-700">
                                    {item.name}
                                </span>
                                {item.urusan ? (
                                    <span className="block truncate text-xs font-semibold text-slate-400">
                                        {item.urusan}
                                    </span>
                                ) : null}
                            </span>
                        )}
                        renderOption={(item) => (
                            <span className="block min-w-0">
                                <span className="block truncate text-sm font-black">
                                    {item.name}
                                </span>
                                {item.urusan ? (
                                    <span className="mt-0.5 block truncate text-xs font-semibold text-slate-400">
                                        {item.urusan}
                                    </span>
                                ) : null}
                            </span>
                        )}
                    />

                    <TextInput
                        label="Nama Aplikasi"
                        value={data.name}
                        onChange={(value) => setData("name", value)}
                        error={errors.name}
                        placeholder="Contoh: ASN Digital"
                    />

                    <TextInput
                        label="Alias"
                        value={data.alias}
                        onChange={(value) => setData("alias", value)}
                        error={errors.alias}
                        placeholder="Nama pendek atau akronim"
                    />

                    <TextInput
                        label="URL"
                        value={data.url}
                        onChange={(value) => setData("url", value)}
                        error={errors.url}
                        placeholder="https://..."
                    />

                    <SearchableSelect
                        label="Kategori"
                        value={data.category_id || ""}
                        onChange={(value) =>
                            setData("category_id", value || "")
                        }
                        options={options?.categories || []}
                        error={errors.category_id}
                        placeholder="Pilih kategori"
                        searchPlaceholder="Cari kategori..."
                        emptyText="Kategori tidak ditemukan"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.title}
                        getSearchText={(item) => item.title}
                    />

                    <SearchableSelect
                        label="Urusan"
                        value={data.urusan_id || ""}
                        onChange={(value) => setData("urusan_id", value || "")}
                        options={options?.urusan || []}
                        error={errors.urusan_id}
                        placeholder="Pilih urusan"
                        searchPlaceholder="Cari urusan atau OPD..."
                        emptyText="Urusan tidak ditemukan"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.title}
                        getSearchText={(item) => item.title}
                    />

                    <SearchableSelect
                        label="Asal Aplikasi"
                        value={data.app_from_id || ""}
                        onChange={(value) =>
                            setData("app_from_id", value || "")
                        }
                        options={options?.app_from || []}
                        error={errors.app_from_id}
                        placeholder="Pilih asal aplikasi"
                        searchPlaceholder="Cari asal aplikasi..."
                        emptyText="Asal aplikasi tidak ditemukan"
                        clearable={false}
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.name}
                        getSearchText={(item) => item.name}
                    />

                    <IconPicker
                        label="Icon"
                        value={data.icon}
                        onChange={(value) => setData("icon", value)}
                        error={errors.icon}
                        placeholder="Nama icon, contoh: FaHome"
                    />
                </div>

                <div className="mt-5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Deskripsi
                    </label>
                    <textarea
                        value={data.description || ""}
                        onChange={(event) =>
                            setData("description", event.target.value)
                        }
                        placeholder="Jelaskan fungsi aplikasi secara singkat."
                        rows={5}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />
                    <FieldError message={errors.description} />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
                    <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                        Pengaturan
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div>
                                <p className="font-black text-slate-900">
                                    Aktif
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Tampilkan aplikasi di portal.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={Boolean(data.is_active)}
                                onChange={(event) =>
                                    setData("is_active", event.target.checked)
                                }
                                className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div>
                                <p className="font-black text-slate-900">SSO</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Tandai aplikasi terintegrasi SSO.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={Boolean(data.is_sso)}
                                onChange={(event) =>
                                    setData("is_sso", event.target.checked)
                                }
                                className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div>
                                <p className="font-black text-slate-900">
                                    Populer
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Centang untuk menampilkan aplikasi di
                                    carousel home.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={Boolean(data.is_popular)}
                                onChange={(event) =>
                                    setData("is_popular", event.target.checked)
                                }
                                className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
                    <p className="text-sm font-black uppercase tracking-widest text-sky-600">
                        Logo / Gambar
                    </p>
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-48 w-full object-contain p-4"
                            />
                        ) : (
                            <div className="grid h-48 place-items-center text-slate-400">
                                <ImagePlus className="h-10 w-10" />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            onImageChange(event.target.files?.[0] || null)
                        }
                        className="mt-4 block w-full text-sm font-bold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:font-black file:text-sky-700 hover:file:bg-sky-100"
                    />
                    <FieldError message={errors.image} />
                </div>
            </div>

            <div className="sticky bottom-4 z-20 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-sm font-black text-white shadow-2xl shadow-sky-200 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save className="h-4 w-4" />{" "}
                    {processing ? "Menyimpan..." : "Simpan Aplikasi"}
                </button>
            </div>
        </form>
    );
}
