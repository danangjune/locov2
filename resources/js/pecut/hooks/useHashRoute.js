import { useEffect, useState } from "react";

function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    return raw || "home";
}

export function useHashRoute() {
    const [route, setRoute] = useState(parseHash);

    useEffect(() => {
        const onHashChange = () => {
            setRoute(parseHash());
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        window.addEventListener("hashchange", onHashChange);

        if (!window.location.hash) {
            window.location.hash = "/home";
        }

        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const navigate = (path) => {
        window.location.hash = `/${path}`;
    };

    return [route, navigate];
}
