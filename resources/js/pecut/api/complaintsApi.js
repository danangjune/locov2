function parseDateValue(value) {
    if (!value) return null;

    // API format: "2025-06-26 19:02:06"
    const normalized = String(value).replace(" ", "T");
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
}

function getLatestHistory(history = []) {
    if (!Array.isArray(history) || history.length === 0) return null;

    return [...history]
        .filter((item) => item?.created_at)
        .sort((a, b) => {
            const dateA = parseDateValue(a.created_at)?.getTime() || 0;
            const dateB = parseDateValue(b.created_at)?.getTime() || 0;

            return dateB - dateA;
        })[0];
}

function isFinishedStatus(status = "") {
    const text = String(status).toLowerCase();

    return (
        text.includes("selesai") ||
        text.includes("diselesaikan") ||
        text.includes("ditutup") ||
        text.includes("selesai diproses")
    );
}

function mapComplaint(item) {
    const images = Array.isArray(item?.bukti) ? item.bukti.filter(Boolean) : [];
    const history = Array.isArray(item?.histori) ? item.histori : [];
    const skpd = Array.isArray(item?.skpd) ? item.skpd : [];

    const latestHistory = getLatestHistory(history);
    const lastStatus = latestHistory?.status || item?.last_status || "-";
    const lastStatusAt = latestHistory?.created_at || null;
    const lastStatusAtLabel = latestHistory?.created_at_label || "-";

    return {
        id: item?.id,
        slug: String(item?.slug || item?.id || item?.no_ticket || "aduan"),
        noTicket: item?.no_ticket || "-",
        name: item?.name || "Aduan Warga",
        title: item?.topik || "Aduan Warga",
        description: item?.aduan || "-",
        summary: item?.summary || item?.aduan || "-",
        location: item?.lokasi || "-",
        createdAt: item?.created_at || null,
        createdAtLabel: item?.created_at_label || "-",
        maps: item?.maps || "",
        mapEmbed: item?.map_embed || null,
        channel: item?.kanal || null,
        skpd,
        history,
        images,
        thumbnail: item?.thumbnail || images[0] || null,
        type: item?.jenis_aduan || "aduan",
        isAduan: Boolean(item?.is_aduan),
        totalImages: Number(item?.total_bukti || images.length || 0),
        totalHistory: Number(item?.total_histori || history.length || 0),
        latestHistory,
        lastStatus,
        lastStatusAt,
        lastStatusAtLabel,
        isFinished: isFinishedStatus(lastStatus),
        raw: item?.raw || item,
    };
}

export async function fetchTopComplaintsFromApi(limit = 6) {
    const response = await fetch(`/api/aduan/top?limit=${limit}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Gagal ambil /api/aduan/top: ${response.status}`);
    }

    const result = await response.json();
    const rows = Array.isArray(result?.data) ? result.data : [];

    return rows.slice(0, limit).map(mapComplaint);
}

export async function fetchComplaintDetailFromApi(id) {
    const response = await fetch(`/api/aduan/detail/${id}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(
            `Gagal ambil /api/aduan/detail/${id}: ${response.status}`,
        );
    }

    const result = await response.json();

    if (!result?.data) {
        return null;
    }

    return mapComplaint(result.data);
}
