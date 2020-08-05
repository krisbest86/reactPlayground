import {
    toast
} from "react-toastify";


export function warning(message, autoclose) {
    toast.warning(message, {
        position: "top-center",
        autoClose: autoclose || 2000
    });
}

export function info(message, autoclose) {
    toast.success(message, {
        position: "top-center",
        autoClose: autoclose || 2000
    });
}

export function errorToast(message, autoclose) {
    toast.error(message, {
        position: "top-center",
        autoClose: autoclose || false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
}