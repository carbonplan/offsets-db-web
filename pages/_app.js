import { ThemeProvider } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import { QueryProvider } from '../components/queries'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <MDXProvider>
        <QueryProvider>
          <Component {...pageProps} />
        </QueryProvider>
      </MDXProvider>
    </ThemeProvider>
  )
}

export default App
