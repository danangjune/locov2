import React from "react";
import { Head, usePage } from "@inertiajs/react";

export default function BrandMeta() {
    const { props } = usePage();
    const brandLogo = props?.brandLogo || {};

    if (!brandLogo?.favicon) return null;

    return (
        <Head>
            <link rel="icon" href={brandLogo.favicon} />
            <link rel="shortcut icon" href={brandLogo.favicon} />
        </Head>
    );
}
