import React from "react";
import { Head } from "@inertiajs/react";

import AdminLayout from "../../../Layouts/AdminLayout";
import AppForm from "./Partials/AppForm";

export default function Edit({ meta = {}, data = {} }) {
    const app = data?.app || null;

    return (
        <>
            <Head title={app?.name ? `Edit ${app.name}` : (meta?.title || "Edit Aplikasi")} />

            <AdminLayout
                title={meta?.title || "Edit Aplikasi"}
                subtitle={app?.name ? `Perbarui data ${app.name}` : (meta?.subtitle || "Perbarui data aplikasi.")}
            >
                <AppForm
                    mode="edit"
                    app={app}
                    parent={data?.parent || null}
                    options={data?.options || {}}
                    parentOptions={data?.parent_options || []}
                    defaults={data?.defaults || {}}
                />
            </AdminLayout>
        </>
    );
}
