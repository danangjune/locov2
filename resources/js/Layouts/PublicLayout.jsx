import React from "react";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";
import FloatingQuickActions from "./Partials/FloatingQuickActions";
import UserWayWidget from "./Partials/UserWayWidget";

export default function PublicLayout({
    children,
    currentRoute = "home",
    withFloatingHelp = true,
}) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Header currentRoute={currentRoute} />
            {children}
            <Footer />

            {/* UserWay tetap menjalankan fitur aksesibilitasnya, tetapi launcher-nya memakai tombol PECUT. */}
            <UserWayWidget />

            {withFloatingHelp ? <FloatingQuickActions /> : null}
        </div>
    );
}
