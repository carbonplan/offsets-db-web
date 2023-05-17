import { Badge, Column, Layout, Row } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Container, Divider, Flex } from 'theme-ui'
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
      container={false}
      nav={'research'}
      url={'https://carbonplan.org/research/offsets-database'}
    >
      <Container>
        <QueryProvider>
          <Row>
            <Column
              start={1}
              width={[6, 8, 3, 3]}
              sx={{
                position: ['relative', 'relative', 'sticky', 'sticky'],
                top: [0, 0, 56, 56],
                height: [
                  'auto',
                  'auto',
                  'calc(100vh - 56px)',
                  'calc(100vh - 56px)',
                ],
                overflowY: ['auto', 'auto', 'scroll', 'scroll'],
                pl: [4, 5, 5, 6],
                ml: [-4, -5, -5, -6],
                // nudge scrollbar over for mobile (1 gutter) and desktop (1 gutter + 1/2 column)
                pr: [
                  16,
                  24,
                  `calc(32px + (100vw - 13 * 32px) / 12 / 2)`,
                  `calc(48px + (100vw - 13 * 48px) / 12 / 2)`,
                ],
                mr: [
                  -16,
                  -24,
                  `calc(-1 * (32px + (100vw - 13 * 32px) / 12 / 2))`,
                  `calc(-1 * (48px + (100vw - 13 * 48px) / 12 / 2))`,
                ],
              }}
            >
              <Box as='h1' variant='styles.h1'>
                Offsets Database
              </Box>
              <Divider sx={{ mr: [-4, -5, -5, -6], ml: [-4, -5, 0, 0] }} />
              <Queries />
            </Column>
            <Column
              start={4}
              width={1}
              sx={{
                borderColor: 'muted',
                borderStyle: 'solid',
                borderWidth: 0,
                borderRightWidth: 1,
                width: '50%',
                height: '100%',
                display: ['none', 'none', 'inherit', 'inherit'],
              }}
            />
            <Column start={[1, 1, 5, 5]} width={[6, 8, 8, 8]}>
              <Divider
                sx={{
                  display: ['inherit', 'inherit', 'none', 'none'],
                  ml: [-4, -5, -5, -6],
                  mr: [-4, -5, 0, 0],
                  mt: 3,
                  mb: 2,
                }}
              />
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
              <Divider
                sx={{ ml: [-4, -5, -5, -6], mr: [-4, -5, 0, 0], mt: 3, mb: 2 }}
              />
              {mode === 'projects' && <Projects />}
            </Column>
          </Row>
        </QueryProvider>
      </Container>
    </Layout>
  )
}

export default Index
