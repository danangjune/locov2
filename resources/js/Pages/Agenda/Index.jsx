import { Head, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    CalendarCheck2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    SearchX,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import MiniCalendar from "../../Components/Agenda/MiniCalendar";
import AgendaCard from "../../Components/Agenda/AgendaCard";
import { classNames } from "../../Utils/helpers";

function parseDateValue(value) {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getMonthInputValue(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${date.getFullYear()}-${month}`;
}

function getMonthFromInput(value) {
    if (!value || !/^\d{4}-\d{2}$/.test(value)) {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [year, month] = value.split("-").map(Number);

    return new Date(year, month - 1, 1);
}

function formatMonthYear(date) {
    return new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
    }).format(date);
}

function getAgendaDateRange(agenda) {
    const startDate = parseDateValue(agenda?.start_date || agenda?.startDate || agenda?.date_start);
    const rawEndDate = parseDateValue(agenda?.end_date || agenda?.endDate || agenda?.date_end);

    if (!startDate) {
        return {
            startDate: null,
            endDate: null,
        };
    }

    const endDate = rawEndDate && rawEndDate >= startDate ? rawEndDate : startDate;

    return {
        startDate,
        endDate,
    };
}

function isAgendaInMonth(agenda, selectedMonth) {
    const { startDate, endDate } = getAgendaDateRange(agenda);

    if (!startDate) return false;

    const monthStart = getMonthStart(selectedMonth);
    const monthEnd = getMonthEnd(selectedMonth);

    return startDate <= monthEnd && endDate >= monthStart;
}

function isAgendaStartInMonth(agenda, selectedMonth) {
    const { startDate } = getAgendaDateRange(agenda);

    if (!startDate) return false;

    return (
        startDate.getFullYear() === selectedMonth.getFullYear()
        && startDate.getMonth() === selectedMonth.getMonth()
    );
}

function isAgendaStartOnDate(agenda, selectedMonth, day) {
    const { startDate } = getAgendaDateRange(agenda);

    if (!startDate) return false;

    return (
        isAgendaStartInMonth(agenda, selectedMonth)
        && startDate.getDate() === Number(day)
    );
}

function isOngoingAgenda(agenda) {
    const { startDate, endDate } = getAgendaDateRange(agenda);

    if (!startDate) return false;

    const today = startOfDay(new Date());

    return today >= startOfDay(startDate) && today <= startOfDay(endDate);
}

function isMultiMonthAgenda(agenda) {
    const { startDate, endDate } = getAgendaDateRange(agenda);

    if (!startDate || !endDate) return false;

    return (
        startDate.getMonth() !== endDate.getMonth()
        || startDate.getFullYear() !== endDate.getFullYear()
    );
}

function getStartDatesForCalendar(agendas, selectedMonth, type) {
    return agendas
        .filter((agenda) => agenda?.type === type)
        .filter((agenda) => isAgendaStartInMonth(agenda, selectedMonth))
        .map((agenda) => getAgendaDateRange(agenda).startDate?.getDate())
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort((first, second) => first - second);
}

function getAgendaStatusLabel(agenda) {
    if (isOngoingAgenda(agenda)) {
        return {
            label: "Sedang Berlangsung",
            className: "bg-emerald-100 text-emerald-700 ring-emerald-200",
            Icon: CheckCircle2,
        };
    }

    if (isMultiMonthAgenda(agenda)) {
        return {
            label: "Lintas Bulan",
            className: "bg-violet-100 text-violet-700 ring-violet-200",
            Icon: CalendarDays,
        };
    }

    return null;
}

function getAgendaMonthNote(agenda, selectedMonth) {
    const { startDate, endDate } = getAgendaDateRange(agenda);

    if (!startDate) return null;

    const monthStart = getMonthStart(selectedMonth);
    const monthEnd = getMonthEnd(selectedMonth);

    if (isOngoingAgenda(agenda)) {
        return `Masih berlangsung sampai ${agenda?.end_label || agenda?.fullDate || formatMonthYear(endDate)}.`;
    }

    if (startDate < monthStart && endDate >= monthStart) {
        return `Agenda dimulai bulan sebelumnya dan masih masuk periode ${formatMonthYear(selectedMonth)}.`;
    }

    if (startDate <= monthEnd && endDate > monthEnd) {
        return `Agenda dimulai bulan ini dan berlanjut ke bulan berikutnya.`;
    }

    return null;
}

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const agendas = Array.isArray(data?.agendas?.items)
        ? data.agendas.items
        : [];

    const stats = data?.stats || {};
    const error = data?.errors?.agenda || "";

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [selectedDate, setSelectedDate] = useState(() => {
        const date = filter?.date ? Number(filter.date) : null;
        return Number.isFinite(date) && date > 0 ? date : null;
    });

    const monthAgendas = useMemo(() => {
        return agendas
            .filter((agenda) => isAgendaInMonth(agenda, selectedMonth))
            .sort((first, second) => {
                const firstDate = getAgendaDateRange(first).startDate?.getTime() || 0;
                const secondDate = getAgendaDateRange(second).startDate?.getTime() || 0;

                return firstDate - secondDate;
            });
    }, [agendas, selectedMonth]);

    const displayedAgendas = useMemo(() => {
        if (!selectedDate) {
            return monthAgendas;
        }

        return monthAgendas.filter((agenda) => isAgendaStartOnDate(agenda, selectedMonth, selectedDate));
    }, [monthAgendas, selectedDate, selectedMonth]);

    const governmentStartDates = useMemo(
        () => getStartDatesForCalendar(monthAgendas, selectedMonth, "Agenda Pemerintah"),
        [monthAgendas, selectedMonth],
    );

    const publicStartDates = useMemo(
        () => getStartDatesForCalendar(monthAgendas, selectedMonth, "Agenda Publik"),
        [monthAgendas, selectedMonth],
    );

    const currentMonthValue = getMonthInputValue(selectedMonth);

    const openDetail = (agenda) => {
        const targetUrl = agenda?.external_url || agenda?.detail_url || agenda?.url;

        if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
            return;
        }

        router.visit(`/agenda/${agenda.slug}`);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(getMonthFromInput(event.target.value));
        setSelectedDate(null);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <>
            <Head title={meta?.title || "Agenda Kota Kediri"} />

            <PublicLayout currentRoute="agenda">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 text-white">
                        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="max-w-3xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-sky-100 backdrop-blur">
                                    <CalendarCheck2 className="h-4 w-4" /> Kalender Kota
                                </div>

                                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                    Agenda Pemerintah dan Agenda Publik
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-sky-100 sm:text-lg">
                                    Pilih bulan untuk melihat agenda Kota Kediri. Tanggal berwarna menandai tanggal mulai kegiatan, sedangkan agenda yang masih berjalan tetap ditampilkan sebagai sedang berlangsung.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { label: "Total Agenda", value: stats?.total ?? agendas.length },
                                    { label: "Agenda Bulan Ini", value: monthAgendas.length },
                                    { label: "Agenda Pemerintah", value: monthAgendas.filter((agenda) => agenda?.type === "Agenda Pemerintah").length },
                                    { label: "Agenda Publik", value: monthAgendas.filter((agenda) => agenda?.type === "Agenda Publik").length },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                        <p className="text-3xl font-black">{item.value}</p>
                                        <p className="mt-1 text-sm font-bold text-sky-100">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] theme-text-primary">
                                    Filter Bulan
                                </p>
                                <h2 className="mt-1 text-2xl font-black theme-text">
                                    {formatMonthYear(selectedMonth)}
                                </h2>
                                <p className="mt-1 text-sm font-semibold theme-muted">
                                    Kalender otomatis menyesuaikan jumlah hari pada bulan yang dipilih.
                                </p>
                            </div>

                            <label className="grid gap-2 text-sm font-black theme-text">
                                Pilih bulan agenda
                                <input
                                    type="month"
                                    value={currentMonthValue}
                                    onChange={handleMonthChange}
                                    className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black theme-text outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                />
                            </label>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <MiniCalendar
                                title="Agenda Pemerintah"
                                month={formatMonthYear(selectedMonth).split(" ")[0]}
                                year={String(selectedMonth.getFullYear())}
                                monthDate={selectedMonth}
                                eventDates={governmentStartDates}
                                color="sky"
                                selectedDate={selectedDate}
                                onDateClick={handleDateClick}
                            />

                            <MiniCalendar
                                title="Agenda Publik"
                                month={formatMonthYear(selectedMonth).split(" ")[0]}
                                year={String(selectedMonth.getFullYear())}
                                monthDate={selectedMonth}
                                eventDates={publicStartDates}
                                color="amber"
                                selectedDate={selectedDate}
                                onDateClick={handleDateClick}
                            />
                        </div>

                        <div className="mt-5 rounded-3xl bg-sky-50 px-5 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm font-bold text-sky-800">
                                    {selectedDate
                                        ? `Menampilkan agenda yang dimulai pada tanggal ${selectedDate} ${formatMonthYear(selectedMonth)}`
                                        : `Menampilkan agenda yang masuk periode ${formatMonthYear(selectedMonth)}`}
                                </p>

                                {selectedDate ? (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDate(null)}
                                        className="rounded-full bg-white px-4 py-2 text-xs font-black text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100"
                                    >
                                        Tampilkan semua agenda bulan ini
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-10">
                            <SectionHeader
                                eyebrow="Daftar Agenda"
                                title={`${displayedAgendas.length} agenda ditemukan`}
                                subtitle="Temukan agenda kegiatan Pemerintah Kota Kediri dan kegiatan publik yang dapat diikuti."
                            />

                            {error && (
                                <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800">
                                    {error}
                                </div>
                            )}

                            {displayedAgendas.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {displayedAgendas.map((agenda) => {
                                        const status = getAgendaStatusLabel(agenda);
                                        const note = getAgendaMonthNote(agenda, selectedMonth);

                                        return (
                                            <div key={agenda.slug || agenda.id} className="min-w-0 space-y-3">
                                                <div className="relative">
                                                    {status ? (
                                                        <div className="absolute right-4 top-4 z-20">
                                                            <span className={classNames(
                                                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-sm ring-1",
                                                                status.className,
                                                            )}>
                                                                <status.Icon className="h-3.5 w-3.5" />
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                    ) : null}

                                                    <AgendaCard
                                                        agenda={agenda}
                                                        variant={agenda.type === "Agenda Pemerintah" ? "government" : "public"}
                                                        onOpen={() => openDetail(agenda)}
                                                    />
                                                </div>

                                                {note ? (
                                                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-100">
                                                        {note}
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                                    <SearchX className="mx-auto h-12 w-12 text-sky-300" />
                                    <h3 className="mt-4 text-xl font-black text-slate-900">
                                        Tidak ada agenda ditemukan
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Belum ada agenda pada {selectedDate ? `tanggal ${selectedDate} ` : ""}{formatMonthYear(selectedMonth)}. Silakan pilih bulan lain.
                                    </p>

                                    {selectedDate ? (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDate(null)}
                                            className="mt-5 rounded-full btn-theme-primary px-5 py-3 text-sm font-black shadow-lg shadow-sky-100"
                                        >
                                            Tampilkan Semua Agenda Bulan Ini
                                        </button>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
