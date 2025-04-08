import { Column, Layout, Row } from '@carbonplan/components'
import { Box, Container, Divider } from 'theme-ui'
import Sidebar from './sidebar'
import Queries from './queries'
import ProjectCharts from './charts/project-charts'
import ViewHeading from './view-heading'

const LandingLayout = ({ children }) => {
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
          <Column
            start={[1, 1, 5, 5]}
            width={[6, 8, 8, 8]}
            sx={{
              height: [
                'inherit',
                'inherit',
                'calc(100vh - 56px)',
                'calc(100vh - 56px)',
              ],
              overflowY: ['inherit', 'inherit', 'scroll', 'scroll'],
              mx: [-4, -5, -5, -6],
              px: [4, 5, 5, 6],
              position: 'relative',
            }}
          >
            <Divider
              sx={{
                display: ['inherit', 'inherit', 'none', 'none'],
                ml: [-4, -5, -5, -6],
                mr: [-4, -5, 0, 0],
                mt: 3,
                mb: 1,
              }}
            />
            <ViewHeading border />
            <ProjectCharts />
            <Box sx={{ mt: 5 }}>{children}</Box>
          </Column>
        </Row>
      </Container>
    </Layout>
  )
}

export default LandingLayout
