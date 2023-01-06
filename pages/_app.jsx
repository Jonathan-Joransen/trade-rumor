import '../styles/globals.css'
import { SessionProvider, useSession } from 'next-auth/react'

export default function App({ Component, pageProps }) {
  return ( 
  <SessionProvider session={pageProps.session} basePath="https://nbatraderumor.com"> 
      {Component.auth === true ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
  </SessionProvider> 
  )
}

const Auth = ({ children }) => {
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children
}