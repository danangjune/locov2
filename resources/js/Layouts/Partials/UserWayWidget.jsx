import { useEffect } from "react";
import { usePage } from "@inertiajs/react";

const SCRIPT_ID = "pecut-userway-widget";
const USERWAY_ACCOUNT = "FCl1e8LsIe";

/**
 * Memuat UserWay sekali saja dan menyembunyikan launcher bawaan.
 * Launcher digantikan oleh tombol React pada FloatingQuickActions.jsx.
 */
export default function UserWayWidget() {
    const { props } = usePage();

    const themePrimary =
        props?.theme?.colors?.secondary_color ||
        props?.theme?.colors?.secondary_color ||
        "#1e6fa5";

    useEffect(() => {
        const exposeUserWay = (event) => {
            const instance = event?.detail?.userWayInstance || window.UserWay;

            if (!instance) {
                return;
            }

            window.__pecutUserWay = instance;

            try {
                instance.iconVisibilityOff?.();
            } catch (error) {
                // Tidak mengganggu halaman apabila versi widget belum menyediakan API ini.
                console.warn("UserWay launcher belum dapat disembunyikan.", error);
            }

            window.dispatchEvent(new CustomEvent("pecut:userway-ready"));

            if (window.__pecutUserWayOpenRequested) {
                window.__pecutUserWayOpenRequested = false;
                instance.widgetOpen?.();
            }
        };

        document.addEventListener("userway:init_completed", exposeUserWay);

        const existingScript = document.getElementById(SCRIPT_ID);

        if (!existingScript) {
            const script = document.createElement("script");

            script.id = SCRIPT_ID;
            script.async = true;
            script.src = "https://cdn.userway.org/widget.js";
            script.setAttribute("data-account", USERWAY_ACCOUNT);
            script.setAttribute("data-color", themePrimary);
            script.setAttribute("data-position", "3");
            script.setAttribute("data-size", "small");
            script.setAttribute("data-mobile", "true");

            document.body.appendChild(script);
        } else if (window.UserWay) {
            exposeUserWay();
        }

        return () => {
            document.removeEventListener("userway:init_completed", exposeUserWay);
        };
    }, []);

    return null;
}
