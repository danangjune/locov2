import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { classNames } from "../../Utils/helpers";

export default function NewsCard({ news, onOpen, large = false }) {
    const openNews = () => {
        if (onOpen) {
            onOpen(news);
        }
    };

    return (
        <motion.article
            whileHover={{ y: -4 }}
            className={classNames(
                "overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100",
                large ? "lg:grid lg:grid-cols-[1.1fr_0.9fr]" : "flex flex-col",
            )}
        >
            <button
                type="button"
                onClick={openNews}
                className={classNames(
                    "relative block w-full overflow-hidden text-left",
                    large ? "h-64 lg:h-full" : "h-56",
                )}
            >
                <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-sky-700 shadow">
                    {news.tag}
                </div>
            </button>

            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold text-slate-400">{news.date}</p>

                <button
                    type="button"
                    onClick={openNews}
                    className="mt-2 block text-left text-lg font-black leading-snug text-slate-900 hover:text-sky-700"
                >
                    {news.title}
                </button>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {news.excerpt}
                </p>

                <button
                    type="button"
                    onClick={openNews}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-sky-700"
                >
                    Baca selengkapnya
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.article>
    );
}
