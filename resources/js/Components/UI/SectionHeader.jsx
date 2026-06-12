import { ArrowRight } from "lucide-react";

export default function SectionHeader({
    eyebrow,
    title,
    subtitle,
    action,
    onAction,
}) {
    return (
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
                {eyebrow && (
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                        {eyebrow}
                    </p>
                )}

                <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-2 max-w-2xl text-base text-slate-500">
                        {subtitle}
                    </p>
                )}
            </div>

            {action && (
                <button
                    onClick={onAction}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm hover:bg-sky-50"
                >
                    {action}
                    <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
