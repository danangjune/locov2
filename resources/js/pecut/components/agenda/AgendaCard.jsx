import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function AgendaCard({ agenda, variant = "government", onOpen }) {
    const isGovernment = variant === "government";

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100"
        >
            <button
                onClick={onOpen}
                className="relative block h-44 w-full overflow-hidden text-left"
            >
                <img
                    src={agenda.image}
                    alt={agenda.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />

                <span
                    className={classNames(
                        "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black shadow-sm",
                        isGovernment
                            ? "bg-sky-100 text-sky-700"
                            : "bg-amber-100 text-amber-700",
                    )}
                >
                    {isGovernment ? "Pemerintah" : "Publik"}
                </span>
            </button>

            <div className="p-5">
                <div className="flex items-center gap-3">
                    <div
                        className={classNames(
                            "flex h-12 w-12 items-center justify-center rounded-2xl",
                            isGovernment
                                ? "bg-sky-50 text-sky-700"
                                : "bg-amber-50 text-amber-700",
                        )}
                    >
                        <CalendarDays className="h-6 w-6" />
                    </div>

                    <div>
                        <p
                            className={classNames(
                                "text-sm font-black",
                                isGovernment
                                    ? "text-sky-700"
                                    : "text-amber-700",
                            )}
                        >
                            {agenda.fullDate}
                        </p>

                        <p className="text-xs font-semibold text-slate-400">
                            {agenda.time}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onOpen}
                    className="mt-4 block text-left text-lg font-black leading-snug text-slate-900 hover:text-sky-700"
                >
                    {agenda.title}
                </button>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin
                        className={classNames(
                            "h-4 w-4",
                            isGovernment ? "text-sky-600" : "text-amber-600",
                        )}
                    />
                    {agenda.location}
                </p>
            </div>
        </motion.div>
    );
}
