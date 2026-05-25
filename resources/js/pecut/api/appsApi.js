export async function fetchAppsByCategory(categoryId) {
    const firstResponse = await fetch(`/api/apps?category_id=${categoryId}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!firstResponse.ok) {
        throw new Error(
            `Gagal ambil /api/apps?category_id=${categoryId}: ${firstResponse.status}`,
        );
    }

    const firstResult = await firstResponse.json();
    const firstData = Array.isArray(firstResult?.data) ? firstResult.data : [];
    const lastPage = Number(firstResult?.meta?.last_page || 1);

    if (lastPage <= 1) {
        return {
            data: firstData,
            meta: firstResult?.meta || null,
        };
    }

    const pageRequests = [];

    for (let page = 2; page <= lastPage; page += 1) {
        pageRequests.push(
            fetch(`/api/apps?category_id=${categoryId}&page=${page}`, {
                headers: {
                    Accept: "application/json",
                },
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Gagal ambil /api/apps?category_id=${categoryId}&page=${page}: ${response.status}`,
                    );
                }

                return response.json();
            }),
        );
    }

    const otherResults = await Promise.all(pageRequests);
    const otherData = otherResults.flatMap((result) =>
        Array.isArray(result?.data) ? result.data : [],
    );

    return {
        data: [...firstData, ...otherData],
        meta: firstResult?.meta || null,
    };
}

export async function fetchAllAppsFromApi() {
    const [publicApps, asnApps] = await Promise.all([
        fetchAppsByCategory(1),
        fetchAppsByCategory(2),
    ]);

    return {
        data: [...publicApps.data, ...asnApps.data],
        meta: {
            total:
                Number(publicApps?.meta?.total || publicApps.data.length) +
                Number(asnApps?.meta?.total || asnApps.data.length),
            public_total: Number(
                publicApps?.meta?.total || publicApps.data.length,
            ),
            asn_total: Number(asnApps?.meta?.total || asnApps.data.length),
        },
    };
}
