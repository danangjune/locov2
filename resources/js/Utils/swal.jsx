import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);

const colors = {
    primary: "#0284c7",
    danger: "#e11d48",
    secondary: "#64748b",
};

export const alertSuccess = ({ title = "Berhasil", text = "Proses berhasil dilakukan.", timer = 1600 } = {}) => {
    return MySwal.fire({
        icon: "success",
        title,
        html: <p className="text-sm text-slate-600">{text}</p>,
        timer,
        showConfirmButton: false,
    });
};

export const alertError = ({ title = "Gagal", text = "Terjadi kesalahan. Silakan coba lagi.", confirmButtonText = "Tutup" } = {}) => {
    return MySwal.fire({
        icon: "error",
        title,
        html: <p className="text-sm text-slate-600">{text}</p>,
        confirmButtonText,
        confirmButtonColor: colors.primary,
    });
};

export const alertWarning = ({ title = "Perhatian", text = "Silakan periksa kembali data Anda.", confirmButtonText = "Mengerti" } = {}) => {
    return MySwal.fire({
        icon: "warning",
        title,
        html: <p className="text-sm text-slate-600">{text}</p>,
        confirmButtonText,
        confirmButtonColor: colors.primary,
    });
};

export const confirmDelete = ({ title = "Hapus Data?", itemName = "", text = "Data yang dihapus tidak bisa dikembalikan.", confirmButtonText = "Ya, Hapus", cancelButtonText = "Batal" } = {}) => {
    return MySwal.fire({
        icon: "warning",
        title,
        html: (
            <div className="space-y-2 text-sm leading-7 text-slate-600">
                {itemName ? (
                    <p>
                        Data <span className="font-black text-slate-900">{itemName}</span> akan dihapus.
                    </p>
                ) : null}
                <p>{text}</p>
            </div>
        ),
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: colors.danger,
        cancelButtonColor: colors.secondary,
        reverseButtons: true,
        focusCancel: true,
    });
};

export const confirmAction = ({ icon = "question", title = "Lanjutkan Proses?", text = "Apakah Anda yakin ingin melanjutkan proses ini?", confirmButtonText = "Ya, Lanjutkan", cancelButtonText = "Batal", confirmButtonColor = colors.primary } = {}) => {
    return MySwal.fire({
        icon,
        title,
        html: <p className="text-sm leading-7 text-slate-600">{text}</p>,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        cancelButtonColor: colors.secondary,
        reverseButtons: true,
        focusCancel: true,
    });
};

export const confirmSave = ({ title = "Simpan Data?", text = "Pastikan data yang Anda masukkan sudah benar.", confirmButtonText = "Ya, Simpan", cancelButtonText = "Batal" } = {}) => {
    return confirmAction({ icon: "question", title, text, confirmButtonText, cancelButtonText, confirmButtonColor: colors.primary });
};

export const confirmUpdate = ({ title = "Perbarui Data?", text = "Perubahan data akan disimpan ke sistem.", confirmButtonText = "Ya, Perbarui", cancelButtonText = "Batal" } = {}) => {
    return confirmAction({ icon: "question", title, text, confirmButtonText, cancelButtonText, confirmButtonColor: colors.primary });
};

export const toastSuccess = ({ title = "Berhasil", timer = 1800 } = {}) => {
    return MySwal.fire({ toast: true, position: "top-end", icon: "success", title, showConfirmButton: false, timer, timerProgressBar: true });
};

export const toastError = ({ title = "Gagal", timer = 2200 } = {}) => {
    return MySwal.fire({ toast: true, position: "top-end", icon: "error", title, showConfirmButton: false, timer, timerProgressBar: true });
};

export const loadingSwal = ({ title = "Memproses...", text = "Mohon tunggu sebentar." } = {}) => {
    return MySwal.fire({
        title,
        html: <p className="text-sm text-slate-600">{text}</p>,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => MySwal.showLoading(),
    });
};

export const closeSwal = () => MySwal.close();
