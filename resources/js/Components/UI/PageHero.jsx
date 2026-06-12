import React from "react";
import { classNames } from "../../Utils/helpers";

export default function PageHero({
    eyebrow,
    title,
    subtitle,
    icon: Icon,
    gradient = "from-sky-600 to-blue-700",
}) {
    return (
        <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div className="max-w-3xl">
                    {eyebrow && (
                        <div className="inline-flex rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-black text-sky-700 shadow-sm">
                            {eyebrow}
                        </div>
                    )}

                    <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className={classNames("flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br text-white shadow-2xl", gradient)}>
                        <Icon className="h-12 w-12" />
                    </div>
                )}
            </div>
        </section>
    );
}
