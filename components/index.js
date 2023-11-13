import { useRouter } from 'next/router'

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
  const router = useRouter()

  return (
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
  )
}

export default Index
