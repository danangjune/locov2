import { Link } from "@inertiajs/react";
import { Bell } from "lucide-react";

export default function FloatingHelpButton() {
    return (
        <Link
            href="/help"
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-2xl shadow-sky-200 hover:bg-sky-700"
        >
            <Bell className="h-4 w-4" /> Bantuan PECUT
        </Link>
    );
}
