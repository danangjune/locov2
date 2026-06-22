import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

import "../css/pecut.css";
import "../css/theme.css";
import "../css/app.css";
import "./bootstrap";

createInertiaApp({
    title: (title) =>
        title ? `${title} - PECUT Kota Kediri` : "PECUT Kota Kediri",

    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
