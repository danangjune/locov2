export async function fetchTopNewsFromApi(limit = 10) {
    const response = await fetch(`/api/berita/top?limit=${limit}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Gagal ambil /api/berita/top: ${response.status}`);
    }

    const result = await response.json();

    return Array.isArray(result?.data) ? result.data : [];
}
