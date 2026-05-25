import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import { appPalettes } from "../../data/staticData";
import { classNames } from "../../utils/helpers";
import ModeBadge from "./ModeBadge";

export default function AppCard({ app, compact = false, index = 0, onOpen }) {
    const Icon = app.icon;
    const palette = appPalettes[index % appPalettes.length];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 hover:shadow-xl"
        >
            <div
                className={classNames(
                    "absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br",
                    palette.soft,
                )}
            />

            <div className="relative flex items-start justify-between gap-4">
                <button
                    onClick={onOpen}
                    className={classNames(
                        "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105",
                        palette.bg,
                        palette.shadow,
                    )}
                    aria-label={`Buka detail ${app.name}`}
                >
                    <Icon className="h-7 w-7" />
                </button>

                <ModeBadge mode={app.mode} />
            </div>

            <div className="relative mt-5">
                <p
                    className={classNames(
                        "text-xs font-bold uppercase tracking-wide",
                        palette.text,
                    )}
                >
                    {app.type}
                </p>

                <button
                    onClick={onOpen}
                    className="mt-1 block text-left text-lg font-extrabold text-slate-900 hover:text-sky-700"
                >
                    {app.name}
                </button>

                <p
                    className={classNames(
                        "mt-2 text-sm leading-6 text-slate-500",
                        compact ? "line-clamp-2" : "",
                    )}
                >
                    {app.desc}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-slate-100 pt-4">
                    <span className="line-clamp-1 text-xs font-medium text-slate-400">
                        {app.category}
                    </span>

                    <button
                        onClick={onOpen}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-600"
                    >
                        Buka
                        <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
