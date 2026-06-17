import React from "react";
import * as FaIcons from "react-icons/fa";

export function getIconComponent(value = "") {
    if (!value) return null;

    return FaIcons[value] || null;
}

export function DynamicIcon({
    name,
    className = "h-5 w-5",
    fallback = null,
}) {
    const IconComponent = getIconComponent(name);

    if (!IconComponent) {
        return fallback;
    }

    return <IconComponent className={className} />;
}

export function getIconOptions(query = "", limit = 120) {
    const keyword = String(query || "").toLowerCase();

    const result = Object.keys(FaIcons)
        .filter((iconName) => /^[A-Z]/.test(iconName))
        .filter((iconName) => {
            if (!keyword) return true;

            return iconName.toLowerCase().includes(keyword);
        })
        .map((iconName) => ({
            value: iconName,
            name: iconName,
            packLabel: "Font Awesome",
            IconComponent: FaIcons[iconName],
        }));

    return result.slice(0, limit);
}