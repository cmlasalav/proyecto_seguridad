// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/global.css";
import { AuthProvider } from "../context/authContext";
import { ToastProvider } from "../components/Extra/ToastMessage";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastProvider />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
