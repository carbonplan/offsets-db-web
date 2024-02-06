import { Column, Link } from '@carbonplan/components'
import { Box, Divider } from 'theme-ui'
import LastUpdated from './last-updated'

const Sidebar = ({ children }) => {
  return (
    <>
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
          pb: [4, 3, 5, 5],
        }}
      >
        <Box as='h1' sx={{ variant: 'styles.h1', mt: 4, mb: 3 }}>
          OffsetsDB
        </Box>
        <Box as='p' sx={{ mb: 5 }}>
          This database collects and standardizes all the carbon offset projects
          and credits listed by the six largest offset registries: American
          Carbon Registry (ACR), ART TREES (ART), Climate Action Reserve (CAR),
          Global Carbon Council (GCC), Gold Standard (GLD), and Verra (VCS).
          <br />
          <br />
          View the latest <Link href='/updates'>updates</Link> or download the{' '}
          <Link href='https://offsets-db-data.readthedocs.io/en/latest/data-access.html'>
            data
          </Link>
          . Read the{' '}
          <Link href='/research/offsets-db-explainer'>explainer article</Link>{' '}
          or <Link href='/research/offsets-db-methods'>methods</Link> for more
          detail.
          <br />
          <br />
          <LastUpdated />
        </Box>
        <Divider sx={{ mr: [-4, -5, -5, -6], ml: [-4, -5, 0, 0] }} />
        {children}
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
    </>
  )
}

export default Sidebar
