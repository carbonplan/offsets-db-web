import { Badge } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { Box, Flex, Link } from 'theme-ui'

import Events from './events'
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
      <Flex
        sx={{
          gap: 3,
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          my: 3,
        }}
      >
        <Box sx={{ color: 'secondary' }}>View by</Box>
        <Link
          sx={sx.badge(mode === 'projects')}
          onClick={() => router.push('/projects')}
        >
          <Badge>Projects</Badge>
        </Link>
        <Link
          sx={sx.badge(mode === 'credits')}
          onClick={() => router.push('/credits')}
        >
          <Badge>Credits</Badge>
        </Link>
      </Flex>
      {mode === 'projects' && <Projects />}
      {mode === 'credits' && <Events />}
    </Layout>
  )
}

export default Index
