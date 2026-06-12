import React from "react";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";
import FloatingHelpButton from "./Partials/FloatingHelpButton";

export default function PublicLayout({ children, currentRoute = "home", withFloatingHelp = true }) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Header currentRoute={currentRoute} />
            {children}
            <Footer />
            {withFloatingHelp && <FloatingHelpButton />}
        </div>
    );
}
