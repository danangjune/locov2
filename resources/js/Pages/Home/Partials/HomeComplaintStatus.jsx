import React from "react";
import ComplaintStatusChecker from "../../../Components/Complaints/ComplaintStatusChecker";

export default function HomeComplaintStatus() {
    return (
        <section className="relative overflow-hidden theme-gradient-soft py-14 sm:py-16">
            <div className="absolute inset-x-0 top-0 h-px theme-footer-top-line" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ComplaintStatusChecker
                    compact
                    title="Cek Status Aduan Anda"
                    subtitle="Pantau perkembangan aduan Lapor Mbak Wali secara cepat menggunakan nomor tiket yang diterima saat membuat laporan."
                />
            </div>
        </section>
    );
}
