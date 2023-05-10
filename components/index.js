import { Badge, Column, Filter, Layout, Row } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Divider, Flex } from 'theme-ui'
import Projects from './projects'
import Queries, { QueryProvider } from './queries'
const Index = () => {
  const [mode, setMode] = useState('projects')

  return (
    <Layout
      title='Offsets Database – CarbonPlan'
      description='TK'
      card='TK'
      footer={false}
      metadata={false}
      nav={'research'}
      url={'https://carbonplan.org/research/offsets-database'}
    >
      <QueryProvider>
        <Row>
          <Column start={1} width={3}>
            <Box as='h1' variant='styles.h1'>
              Offsets Database
            </Box>
            <Divider sx={{ mr: [-4, -5, -5, -6] }} />
            <Queries />{' '}
          </Column>
          <Column
            start={4}
            width={1}
            sx={{
              borderColor: 'muted',
              borderStyle: 'solid',
              borderWidth: 0,
              borderRightWidth: 1,
              mt: 5,
              width: '50%',
              height: 'calc(100vh - 56px)',
            }}
          />
          <Column start={[1, 1, 5, 5]} width={[6, 8, 8, 8]}>
            <Flex
              sx={{
                gap: 3,
                fontFamily: 'mono',
                letterSpacing: 'mono',
                textTransform: 'uppercase',
                mt: 3,
              }}
            >
              <Box sx={{ color: 'secondary' }}>View by</Box>
              <Badge
                sx={{ color: mode === 'projects' ? 'primary' : 'secondary' }}
              >
                Projects
              </Badge>
              <Badge
                sx={{ color: mode === 'projects' ? 'secondary' : 'primary' }}
              >
                Events
              </Badge>
            </Flex>
            <Divider sx={{ ml: [-4, -5, -5, -6], mt: 3, mb: 2 }} />
            {mode === 'projects' && <Projects />}
          </Column>
        </Row>
      </QueryProvider>
    </Layout>
  )
}

export default Index
