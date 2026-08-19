import { Box } from 'theme-ui'
import { Link } from '@carbonplan/components'

const Notice = () => {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          display: ['none', 'none', 'block', 'block'],
          top: '16px',
          left: [
            'calc(32.5% + 32px)',
            'calc(32.5% + 32px)',
            'calc(32.5% + 32px)',
            'calc(32.5% + 48px)',
          ],
          color: 'secondary',
          zIndex: 5000,
        }}
      >
        <Box
          as='span'
          sx={{
            '@media (max-width: 1140px)': {
              display: 'none',
            },
          }}
        >
          We've paused updates to OffsetsDB while we try to resolve issues with
          data access.
        </Box>
        <Box
          as='span'
          sx={{
            '@media (min-width: 1141px)': {
              display: 'none',
            },
          }}
        >
          We've paused updates while we try to resolve data access issues.
        </Box>
      </Box>
      <Box
        sx={{
          display: ['inherit', 'inherit', 'none', 'none'],
          top: '68px',
          left: ['24px', '32px', 0],
          color: 'secondary',
          zIndex: 5000,
          fontSize: [1],
          mt: [3],
          borderBottom: ({ colors }) => `solid 1px ${colors.muted}`,
          pb: [3],
        }}
      >
        We've paused updates to OffsetsDB while we try to resolve issues with
        data access.
      </Box>
    </>
  )
}

export default Notice
