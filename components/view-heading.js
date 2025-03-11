import { Filter } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'
import { useRouter } from 'next/router'

const ViewHeading = ({ border }) => {
  const router = useRouter()

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 56,
        bg: 'background',
        mb: 2,
        borderWidth: 0,
        borderBottom: border ? '1px' : 0,
        borderColor: 'muted',
        borderStyle: 'solid',
        ml: [-4, -5, -5, -6],
        pl: [4, 5, 5, 6],
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
            transactions: router.pathname === '/credits',
            updates: router.pathname === '/updates',
          }}
          setValues={(obj) => {
            if (obj.projects) {
              router.push('/')
            } else if (obj.transactions) {
              router.push('/credits')
            } else {
              router.push('/updates')
            }
          }}
        />
      </Flex>
    </Box>
  )
}

export default ViewHeading
