import { Badge, Column, Filter, Layout, Row } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Divider, Flex } from 'theme-ui'
import Projects from './projects'

const Index = () => {
  const [mode, setMode] = useState('projects')
  const [registries, setRegistries] = useState({
    verra: true,
    'gold-standard': true,
    'global-carbon-council': true,
    'american-carbon-registry': true,
    'climate-action-reserve': true,
    'art-trees': true,
  })

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
      <Row>
        <Column start={1} width={3}>
          <Box as='h1' variant='styles.h1'>
            Offsets Database
          </Box>
          <Divider sx={{ mr: [-4, -5, -5, -6] }} />
          <Filter
            values={registries}
            setValues={setRegistries}
            showAll
            multiSelect
          />
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
          <Divider sx={{ ml: [-4, -5, -5, -6], my: 3 }} />
          {mode === 'projects' && <Projects registries={registries} />}
        </Column>
      </Row>
    </Layout>
  )
}

export default Index
