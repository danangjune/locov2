import React from "react";
import { usePage } from "@inertiajs/react";

const defaultCss = {
    "--theme-primary": "#1E6FA5",
    "--theme-secondary": "#15547D",
    "--theme-accent": "#38BDF8",
    "--theme-background": "#F8FAFC",
    "--theme-surface": "#FFFFFF",
    "--theme-text": "#0F172A",
    "--theme-muted": "#64748B",
};

function isValidHex(value) {
    return /^#[0-9A-Fa-f]{6}$/.test(String(value || ""));
}

function normalizeCss(theme = {}) {
    const css = theme?.css || {};
    const merged = { ...defaultCss };

    Object.keys(defaultCss).forEach((key) => {
        if (isValidHex(css[key])) {
            merged[key] = String(css[key]).toUpperCase();
        }
    });

    return merged;
}

export default function ThemeStyle() {
    const { props } = usePage();
    const css = normalizeCss(props?.theme);

    const content = `:root{${Object.entries(css)
        .map(([key, value]) => `${key}:${value}`)
        .join(";")};}`;

    return <style id="portal-theme-vars">{content}</style>;
}
