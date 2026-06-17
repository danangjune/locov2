import { BadgeCheck, Link as LinkIcon, LockKeyhole } from "lucide-react";
import { classNames } from "../../Utils/helpers";

export default function ModeBadge({ mode }) {
    const config = {
        SSO: {
            label: "SSO",
            icon: BadgeCheck,
            className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        },
        "Non SSO": {
            label: "Non SSO",
            icon: LockKeyhole,
            className: "bg-amber-50 text-amber-700 ring-amber-100",
        },
        Link: {
            label: "Link Web",
            icon: LinkIcon,
            className: "bg-slate-50 text-slate-700 ring-slate-100",
        },
    };

    const item = config[mode] || config.Link;
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
