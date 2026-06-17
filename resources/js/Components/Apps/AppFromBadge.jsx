import { Sparkles, Landmark } from "lucide-react";
import { classNames } from "../../Utils/helpers";

export default function AppFromBadge({ app_from }) {
    const config = {
        LOKAL: {
            label: "LOKAL",
            icon: Sparkles,
            className: "bg-amber-50 text-amber-700 ring-amber-100",
        },
        PUSAT: {
            label: "PUSAT",
            icon: Landmark,
            className: "bg-sky-50 text-sky-700 ring-sky-100",
        },
    };

    const item = config[app_from] || config.LOKAL;
    const Icon = item.icon;

    return (
        <span
            className={classNames(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                item.className,
            )}
        >
            <Icon className="h-3 w-3" />
            {item.label}
        </span>
    );
}
