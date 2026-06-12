import { classNames } from "../../Utils/helpers";

export default function MiniCalendar({
    title,
    month,
    year,
    eventDates = [],
    color = "sky",
    selectedDate = null,
    onDateClick,
}) {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const totalDays = 31;

    const colorMap = {
        sky: {
            active: "bg-sky-600 text-white shadow-lg shadow-sky-100",
            selected: "ring-4 ring-sky-200",
            soft: "bg-sky-50 text-sky-700",
            header: "text-sky-700",
            dot: "bg-white",
        },
        amber: {
            active: "bg-amber-400 text-slate-950 shadow-lg shadow-amber-100",
            selected: "ring-4 ring-amber-200",
            soft: "bg-amber-50 text-amber-700",
            header: "text-amber-700",
            dot: "bg-slate-950",
        },
    };

    const currentColor = colorMap[color] || colorMap.sky;

    return (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Kalender
                    </p>

                    <h3
                        className={classNames(
                            "text-lg font-black",
                            currentColor.header,
                        )}
                    >
                        {title}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {month} {year}
                    </p>
                </div>

                <div
                    className={classNames(
                        "rounded-2xl px-3 py-2 text-xs font-bold",
                        currentColor.soft,
                    )}
                >
                    {eventDates.length} Event
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
                {days.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(
                    (day) => {
                        const hasEvent = eventDates.includes(day);
                        const isSelected = selectedDate === day;

                        return (
                            <button
                                key={day}
                                type="button"
                                disabled={!hasEvent}
                                onClick={() => {
                                    if (hasEvent && onDateClick) {
                                        onDateClick(day);
                                    }
                                }}
                                className={classNames(
                                    "relative flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition",
                                    hasEvent
                                        ? currentColor.active
                                        : "bg-slate-50 text-slate-400",
                                    isSelected ? currentColor.selected : "",
                                    hasEvent
                                        ? "cursor-pointer hover:scale-105"
                                        : "cursor-default",
                                )}
                            >
                                {day}

                                {hasEvent && (
                                    <span
                                        className={classNames(
                                            "absolute bottom-1 h-1 w-1 rounded-full",
                                            currentColor.dot,
                                        )}
                                    />
                                )}
                            </button>
                        );
                    },
                )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
                Klik tanggal berwarna untuk memfilter agenda pada tanggal
                tersebut.
            </p>
        </div>
    );
}
