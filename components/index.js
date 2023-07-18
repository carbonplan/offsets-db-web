import { Badge, Column, Row } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { Box, Divider, Flex, Link } from 'theme-ui'
import Events from './events'
import Projects from './projects'
import Queries from './queries'

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
    <Row>
      <Column
        start={[1, 1, 1, 1]}
        width={[6, 8, 3, 3]}
        sx={{
          position: ['inherit', 'inherit', 'sticky', 'sticky'],
          top: [0, 0, 56, 56],
          height: [
            'inherit',
            'inherit',
            'calc(100vh - 56px)',
            'calc(100vh - 56px)',
          ],
          overflowY: ['inherit', 'inherit', 'scroll', 'scroll'],
          pl: [4, 5, 5, 6],
          ml: [-4, -5, -5, -6],
          // nudge scrollbar over for mobile (1 gutter) and desktop (1 gutter + 1/2 column)
          pr: [
            4,
            5,
            `calc(32px + (100vw - 13 * 32px) / 12 / 2)`,
            `calc(48px + (100vw - 13 * 48px) / 12 / 2)`,
          ],
          mr: [
            -4,
            -5,
            `calc(-1 * (32px + (100vw - 13 * 32px) / 12 / 2))`,
            `calc(-1 * (48px + (100vw - 13 * 48px) / 12 / 2))`,
          ],
        }}
      >
        <Box as='h1' variant='styles.h1'>
          Offsets DB
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
      </Column>
    </Row>
  )
}

export default Index
