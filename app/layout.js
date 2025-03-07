'use client'

import React from 'react'
import Script from 'next/script'
import { ThemeProvider } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'

import { QueryProvider } from '../components/queries'

const App = ({ children }) => {
  return (
    <html lang='en'>
      <body>
        <main>
          <ThemeProvider theme={theme}>
            {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
              <Script
                data-domain='carbonplan.org'
                data-api='https://carbonplan.org/proxy/api/event'
                src='https://carbonplan.org/js/script.file-downloads.outbound-links.js'
              />
            )}
            <MDXProvider>
              <QueryProvider>{children}</QueryProvider>
            </MDXProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}

export default App
