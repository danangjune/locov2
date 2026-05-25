import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";
import { appPalettes } from "../data/staticData";
import { classNames } from "../utils/helpers";

export default function SimpleContentPage({
    eyebrow,
    title,
    subtitle,
    icon: Icon,
    cards,
    navigate,
}) {
    return (
        <PageShell>
            <PageHero
                eyebrow={eyebrow}
                title={title}
                subtitle={subtitle}
                icon={Icon}
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                    {cards.map((card, index) => {
                        const palette = appPalettes[index % appPalettes.length];

                        return (
                            <div
                                key={card.title}
                                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100"
                            >
                                <div
                                    className={classNames(
                                        "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                                        palette.bg,
                                        palette.shadow,
                                    )}
                                >
                                    <card.icon className="h-7 w-7" />
                                </div>

                                <h3 className="mt-5 text-xl font-black text-slate-900">
                                    {card.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {card.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 text-center">
                    <h3 className="text-xl font-black text-slate-900">
                        Lanjut Jelajahi PECUT
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Semua tombol navigasi sudah diarahkan ke halaman
                        interface masing-masing.
                    </p>

                    <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            onClick={() => navigate("apps")}
                            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Lihat Aplikasi
                        </button>

                        <button
                            onClick={() => navigate("help")}
                            className="rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                        >
                            Pusat Bantuan
                        </button>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
