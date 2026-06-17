import React from "react";
import { Head } from "@inertiajs/react";

import AdminLayout from "../../../Layouts/AdminLayout";
import AppForm from "./Partials/AppForm";

export default function Create({ meta = {}, data = {} }) {
    return (
        <>
            <Head title={meta?.title || "Tambah Aplikasi"} />

            <AdminLayout
                title={meta?.title || "Tambah Aplikasi"}
                subtitle={meta?.subtitle || "Tambahkan aplikasi baru ke struktur PECUT."}
            >
                <AppForm
                    mode="create"
                    parent={data?.parent || null}
                    options={data?.options || {}}
                    parentOptions={data?.parent_options || []}
                    defaults={data?.defaults || {}}
                />
            </AdminLayout>
        </>
    );
}
