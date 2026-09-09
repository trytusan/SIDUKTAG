import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../src/context/AuthContext'
import { AlertProvider } from '../src/context/AlertContext'
import { SidebarProvider } from '../src/context/SidebarContext'
import RouteProgressBar from '../src/components/ui/RouteProgressBar'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AlertProvider>
        <SidebarProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          </Head>
          <RouteProgressBar />
          <Component {...pageProps} />
        </SidebarProvider>
      </AlertProvider>
    </AuthProvider>
  )
}
