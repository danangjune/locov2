import { Sparkles } from "lucide-react";
import { classNames } from "../../utils/helpers";

export default function PageHero({
    eyebrow,
    title,
    subtitle,
    icon: Icon = Sparkles,
    gradient = "from-sky-600 to-cyan-500",
}) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 rounded-[2rem] border border-white bg-white/70 p-8 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                            {eyebrow}
                        </p>

                        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                            {title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                            {subtitle}
                        </p>
                    </div>

                    <div
                        className={classNames(
                            "flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.7rem] bg-gradient-to-br text-white shadow-xl",
                            gradient,
                        )}
                    >
                        <Icon className="h-10 w-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
