import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AgendaPagination({ meta = {}, filter = {} }) {
    const currentPage = Number(meta?.current_page || 1);
    const lastPage = Number(meta?.last_page || 1);

    if (lastPage <= 1) {
        return null;
    }

    const goToPage = (page) => {
        router.get(
            "/agenda",
            {
                type: filter?.type || "Semua",
                date: filter?.date || "",
                page,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-500">
                Menampilkan {meta?.from ?? 0} - {meta?.to ?? 0} dari {meta?.total ?? 0} agenda
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >
                    <ChevronLeft className="h-4 w-4" /> Sebelumnya
                </button>

                <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-700">
                    {currentPage} / {lastPage}
                </span>

                <button
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => goToPage(currentPage + 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >
                    Berikutnya <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
