import React from "react";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";
import FloatingQuickActions from "./Partials/FloatingQuickActions";
import UserWayWidget from "./Partials/UserWayWidget";
import ThemeStyle from "../Components/Theme/ThemeStyle";

export default function PublicLayout({
    children,
    currentRoute = "home",
    withFloatingHelp = true,
}) {
    return (
        <div className="min-h-screen theme-bg-page font-sans theme-text">
            <ThemeStyle />

            <Header currentRoute={currentRoute} />
            {children}
            <Footer />

            {/* UserWay tetap menjalankan fitur aksesibilitasnya, tetapi launcher-nya memakai tombol PECUT. */}
            <UserWayWidget />

            {withFloatingHelp ? <FloatingQuickActions /> : null}
        </div>
    );
}
