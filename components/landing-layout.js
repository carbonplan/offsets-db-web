import { Column, Filter, Layout, Row } from '@carbonplan/components'
import { Box, Container, Divider, Flex } from 'theme-ui'
import Sidebar from './sidebar'
import Queries from './queries'
import ProjectCharts from './charts/project-charts'
import { useRouter } from 'next/router'

const LandingLayout = ({ children }) => {
  const router = useRouter()

  return (
    <Layout
      title='OffsetsDB – CarbonPlan'
      description='A harmonized database of carbon offset projects and credits.'
      card='https://images.carbonplan.org/social/offsets-db.png'
      dimmer='top'
      footer={false}
      metadata={false}
      container={false}
      nav={'research'}
      url={'https://carbonplan.org/research/offsets-db'}
    >
      <Container>
        <Row>
          <Sidebar>
            <Queries />
          </Sidebar>
          <Column start={[1, 1, 5, 5]} width={[6, 8, 8, 8]}>
            <Box
              sx={{
                width: '100%',
                position: 'sticky',
                top: 56,
                bg: 'background',
                mb: 2,
                // ml: [-4, -5, -5, -6],
                // pl: [4, 5, 5, 6],
                zIndex: 1,
              }}
            >
              <Flex
                sx={{
                  gap: 3,
                  alignItems: 'baseline',
                  py: 3,
                }}
              >
                <Box
                  sx={{
                    fontSize: [1, 1, 1, 2],
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                    color: 'secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  View by
                </Box>
                <Filter
                  values={{
                    projects: router.pathname === '/',
                    credits: router.pathname === '/credits',
                    updates: false,
                  }}
                  setValues={(obj) => {
                    const key = Object.keys(obj).find((key) => obj[key])
                    if (key === 'projects') {
                      router.push('/')
                    } else {
                      router.push(`/${key}`)
                    }
                  }}
                />
              </Flex>
              <Divider
                sx={{
                  width: '100%',
                  // mx: [-4, -5, -5, -6],
                  my: 0,
                }}
              />
            </Box>
            <Divider
              sx={{
                display: ['inherit', 'inherit', 'none', 'none'],
                ml: [-4, -5, -5, -6],
                mr: [-4, -5, 0, 0],
                mt: 3,
                mb: 2,
              }}
            />
            <ProjectCharts />
            <Box sx={{ mt: 5 }}>{children}</Box>
          </Column>
        </Row>
      </Container>
    </Layout>
  )
}

export default LandingLayout
