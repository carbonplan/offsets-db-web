import { Layout as PageLayout } from '@carbonplan/components'
import { Container } from 'theme-ui'

import Layout from '../components/layout'
import Projects from '../components/projects'
import Queries, { useQueries } from '../components/queries'
import Sidebar from '../components/sidebar'
import Credits from '../components/credits'
import ProjectCharts from '../components/charts/project-charts'

const Index = () => {
  const { view } = useQueries()

  return (
    <PageLayout
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
        <Layout
          sidebar={
            <Sidebar>
              <Queries />
            </Sidebar>
          }
        >
          <ProjectCharts />
          {view === 'projects' ? <Projects /> : <Credits />}
        </Layout>
      </Container>
    </PageLayout>
  )
}

export default Index
