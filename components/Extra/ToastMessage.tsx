import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message, defaultOptions);
  } else {
    toast.error(message, defaultOptions);
  }
};

export const ToastProvider = () => {
  return <ToastContainer />;
};
