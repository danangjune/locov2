import { classNames } from "../../Utils/helpers";

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMonthDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value.getFullYear(), value.getMonth(), 1);
    }

    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getCalendarItems(monthDate) {
    const current = getMonthDate(monthDate);
    const totalDays = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
    const emptyBefore = firstDay === 0 ? 6 : firstDay - 1;

    return [
        ...Array.from({ length: emptyBefore }, (_, index) => ({
            key: `empty-${index}`,
            empty: true,
        })),
        ...Array.from({ length: totalDays }, (_, index) => ({
            key: `day-${index + 1}`,
            empty: false,
            day: index + 1,
            date: new Date(current.getFullYear(), current.getMonth(), index + 1),
        })),
    ];
}

export default function MiniCalendar({
    title,
    month,
    year,
    monthDate = null,
    eventDates = [],
    color = "sky",
    selectedDate = null,
    onDateClick,
}) {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const selectedMonth = getMonthDate(monthDate);
    const calendarItems = getCalendarItems(selectedMonth);
    const today = startOfDay(new Date());

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
    const normalizedEventDates = eventDates.map((date) => Number(date)).filter(Boolean);

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
                    {normalizedEventDates.length} Event
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
                {calendarItems.map((item) => {
                    if (item.empty) {
                        return <div key={item.key} className="h-10 rounded-xl" />;
                    }

                    const hasEvent = normalizedEventDates.includes(item.day);
                    const isSelected = selectedDate === item.day;
                    const isToday = startOfDay(item.date).getTime() === today.getTime();

                    return (
                        <button
                            key={item.key}
                            type="button"
                            disabled={!hasEvent}
                            onClick={() => {
                                if (hasEvent && onDateClick) {
                                    onDateClick(isSelected ? null : item.day);
                                }
                            }}
                            className={classNames(
                                "relative flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition",
                                hasEvent
                                    ? currentColor.active
                                    : "bg-slate-50 text-slate-400",
                                isSelected ? currentColor.selected : "",
                                isToday && hasEvent ? "ring-2 ring-slate-900 ring-offset-2" : "",
                                isToday && !hasEvent ? "theme-bg-primary-soft ring-1 theme-ring-primary-soft theme-text-primary ring-offset-2" : "",
                                hasEvent
                                    ? "cursor-pointer hover:scale-105"
                                    : "cursor-default",
                            )}
                            title={
                                isToday
                                    ? hasEvent
                                        ? "Hari ini dan ada agenda dimulai"
                                        : "Hari ini"
                                    : hasEvent
                                        ? "Ada agenda dimulai pada tanggal ini"
                                        : "Tidak ada agenda dimulai"
                            }
                        >
                            {item.day}

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
                })}
            </div>

            <p className="mt-4 text-xs text-slate-500">
                Tanggal berwarna menandai tanggal mulai agenda. Tanggal hari ini diberi garis tegas.
            </p>
        </div>
    );
}
