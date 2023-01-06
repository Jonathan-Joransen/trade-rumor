import '../styles/globals.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return ( 
  <SessionProvider session={pageProps.session}> 
        <Component {...pageProps} />
  </SessionProvider> 
  )
}