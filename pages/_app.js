import React from 'react'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import { QueryProvider } from '../components/queries'

const App = ({ Component, pageProps }) => {
  return (
    <PlausibleProvider domain='carbonplan.org' trackOutboundLinks>
      <ThemeProvider theme={theme}>
        <MDXProvider>
          <QueryProvider>
            <Component {...pageProps} />
          </QueryProvider>
        </MDXProvider>
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
