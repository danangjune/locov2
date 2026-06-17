import React from "react";
import { Building2, Layers, MapPinned, ShieldCheck } from "lucide-react";

const icons = {
    Layers,
    ShieldCheck,
    Building2,
    MapPinned,
};

const toneClass = {
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

export default function StatCard({ item }) {
    const Icon = icons[item?.icon] || Layers;
    const tone = toneClass[item?.tone] || toneClass.sky;

    return (
        <div className="group rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
            <div className="flex items-start justify-between gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tone}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                    Live
                </div>
            </div>

            <div className="mt-5">
                <p className="text-sm font-bold text-slate-500">{item?.title}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                    <h3 className="text-4xl font-black tracking-tight text-slate-950">
                        {Number(item?.count || 0).toLocaleString("id-ID")}
                    </h3>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">
                    {item?.description}
                </p>
            </div>
        </div>
    );
}
