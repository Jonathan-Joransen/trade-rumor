import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import GlobalHead from "./globalHead";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      session={pageProps.session}
      baseUrl="https://nbatraderumor.com"
    >
      <GlobalHead>
        <Component {...pageProps} />
      </GlobalHead>
    </SessionProvider>
  );
}
