import { ThemeProvider } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import { Layout } from '@carbonplan/components'
import { Container } from 'theme-ui'
import { QueryProvider } from '../components/queries'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <MDXProvider>
        <Layout
          title='Offsets DB – CarbonPlan'
          description='TK'
          card='TK'
          footer={false}
          metadata={false}
          container={false}
          nav={'research'}
          url={'https://carbonplan.org/research/offsets-database'}
        >
          <Container>
            <QueryProvider>
              <Component {...pageProps} />
            </QueryProvider>
          </Container>
        </Layout>
      </MDXProvider>
    </ThemeProvider>
  )
}

export default App
