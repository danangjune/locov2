import { router } from "@inertiajs/react";
import { classNames } from "../../../Utils/helpers";

export default function AgendaFilter({ filter = {}, data = {} }) {
    const types = Array.isArray(data?.types)
        ? data.types
        : ["Semua", "Agenda Pemerintah", "Agenda Publik"];

    const activeType = filter?.type || "Semua";
    const selectedDate = filter?.date || "";

    const updateFilter = (next = {}) => {
        router.get(
            "/agenda",
            {
                type: next.type ?? activeType,
                date: next.date ?? selectedDate,
                page: next.page ?? 1,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div className="mt-8 flex flex-wrap items-center gap-2">
            {types.map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => updateFilter({ type: item, page: 1 })}
                    className={classNames(
                        "rounded-full px-4 py-2 text-sm font-black transition",
                        activeType === item || (!filter?.type && item === "Semua")
                            ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                            : "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-sky-50 hover:text-sky-700",
                    )}
                >
                    {item}
                </button>
            ))}

            {selectedDate && (
                <button
                    type="button"
                    onClick={() => updateFilter({ date: "", page: 1 })}
                    className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                >
                    Reset Tanggal {selectedDate}
                </button>
            )}
        </div>
    );
}
