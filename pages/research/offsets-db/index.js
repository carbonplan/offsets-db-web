import { Layout as PageLayout } from '@carbonplan/components'
import { Container } from 'theme-ui'

import Layout from '../../../components/layout'
import Projects from '../../../components/projects'
import Queries from '../../../components/queries'
import Sidebar from '../../../components/sidebar'

const Index = () => {
  return (
    <PageLayout
      title='OffsetsDB – CarbonPlan'
      description='A database of carbon offset projects and credits harmonized across several offset registries.'
      card='https://images.carbonplan.org/social/offsets-db.png'
      dimmer='top'
      footer={false}
      metadata={false}
      container={false}
      nav={'research'}
    >
      <Container>
        <Layout
          sidebar={
            <Sidebar>
              <Queries />
            </Sidebar>
          }
        >
          <Projects />
        </Layout>
      </Container>
    </PageLayout>
  )
}

export default Index
