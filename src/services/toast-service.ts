import { ToastOptions, toast as toastity } from "react-toastify";

class ToastService {
  success(message: string, options: ToastOptions = {}) {
    toastity.success(message, { ...options, draggable: false });
  }

  info(message: string, options: ToastOptions = {}) {
    toastity.info(message, { ...options, draggable: false });
  }

  warning(message: string, options: ToastOptions = {}) {
    toastity.warning(message, { ...options, draggable: false });
  }

  error(message: string, options: ToastOptions = {}) {
    toastity.error(message, { ...options, draggable: false });
  }
}

export const toastService = new ToastService();
