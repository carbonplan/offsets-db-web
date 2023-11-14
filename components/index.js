import { Layout as PageLayout } from '@carbonplan/components'
import { Container } from 'theme-ui'

import Credits from './credits'
import Layout from './layout'
import Projects from './projects'
import Queries from './queries'
import Sidebar from './sidebar'

const sx = {
  badge: (selected) => ({
    transition: 'color 0.15s',
    '& div': {
      color: selected ? 'primary' : 'secondary',
    },
    '&:hover div': {
      color: !selected ? 'primary' : 'secondary',
    },
  }),
}

const Index = ({ mode }) => {
  return (
    <PageLayout
      title='Offsets DB – CarbonPlan'
      description='TK'
      card='TK'
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
          {mode === 'projects' && <Projects />}
          {mode === 'credits' && <Credits />}
        </Layout>
      </Container>
    </PageLayout>
  )
}

export default Index
