import {
    Archive,
    BarChart3,
    BookOpen,
    Bus,
    Coins,
    Globe2,
    GraduationCap,
    Grid3X3,
    HeartPulse,
    Leaf,
    Megaphone,
    Scale,
    ShoppingBag,
    UserRoundCheck,
} from "lucide-react";

export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function createSlug(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getAppIcon(app) {
    const text = [
        app?.name,
        app?.alias,
        app?.description,
        app?.urusan?.title,
        app?.category?.title,
    ]
        .join(" ")
        .toLowerCase();

    if (text.includes("hukum") || text.includes("jdih")) return Scale;

    if (
        text.includes("pengadaan") ||
        text.includes("lpse") ||
        text.includes("pbj")
    ) {
        return ShoppingBag;
    }

    if (
        text.includes("keuangan") ||
        text.includes("pajak") ||
        text.includes("retribusi")
    ) {
        return Coins;
    }

    if (text.includes("kesehatan") || text.includes("sehat")) {
        return HeartPulse;
    }

    if (
        text.includes("pendidikan") ||
        text.includes("sekolah") ||
        text.includes("belajar")
    ) {
        return GraduationCap;
    }

    if (text.includes("statistik") || text.includes("data")) return BarChart3;
    if (text.includes("kearsipan") || text.includes("arsip")) return Archive;
    if (text.includes("perpustakaan") || text.includes("buku")) return BookOpen;
    if (text.includes("perhubungan") || text.includes("transportasi"))
        return Bus;
    if (text.includes("lingkungan")) return Leaf;
    if (text.includes("pengaduan") || text.includes("lapor")) return Megaphone;

    if (
        text.includes("web profil") ||
        text.includes("website") ||
        text.includes("profil")
    ) {
        return Globe2;
    }

    if (
        text.includes("sso") ||
        text.includes("asn") ||
        text.includes("pegawai")
    ) {
        return UserRoundCheck;
    }

    return Grid3X3;
}

export function mapApiApp(item, index = 0) {
    const urusanTitle = item?.urusan?.title || "Pelayanan";
    const categoryTitle = item?.category?.title || "Layanan Digital";
    const categoryId = Number(item?.category_id ?? item?.category?.id);
    const portalType = categoryId === 2 ? "ASN Digital" : "Public Digital";

    return {
        id: item.id,
        slug: `${item.id}-${createSlug(item.name || item.alias || "aplikasi")}`,
        name: item.name || item.alias || "Aplikasi",
        alias: item.alias || "",
        desc:
            item.description ||
            item.alias ||
            item?.category?.sub_title ||
            "Layanan digital Pemerintah Kota Kediri.",
        detail:
            item.description ||
            item.alias ||
            item?.category?.sub_title ||
            "Layanan digital Pemerintah Kota Kediri yang terhubung melalui portal PECUT.",
        type: portalType,
        category: urusanTitle,
        categoryOriginal: categoryTitle,
        categoryId,
        mode: item.is_sso ? "SSO" : "Link",
        popular: index < 12,
        icon: getAppIcon(item),
        image: item.image,
        url: item.url,
        redirectUrl: `/redirect/${item.id}`,
        raw: item,
    };
}
