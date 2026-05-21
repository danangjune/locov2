import React from "react";
import { Sparkles } from "lucide-react";

export default function App() {
    return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center p-6">
            <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-white">
                    <Sparkles size={34} />
                </div>

                <h1 className="text-3xl font-black text-slate-900">
                    PECUT Kota Kediri
                </h1>

                <p className="mt-3 text-slate-600">
                    React sudah berhasil jalan di dalam Laravel.
                </p>

                <button className="mt-6 rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white">
                    Test Berhasil
                </button>
            </div>
        </div>
    );
}
