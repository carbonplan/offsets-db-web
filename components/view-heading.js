import { Filter } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'
import { useRouter } from 'next/router'

const ViewHeading = ({ border = true, sticky = true }) => {
  const router = useRouter()

  return (
    <Box
      sx={{
        position: sticky ? 'sticky' : 'inherit',
        top: [56, 56, 0, 0],
        bg: 'background',
        mb: 2,
        borderWidth: 0,
        borderBottom: border ? '1px' : 0,
        borderColor: 'muted',
        borderStyle: 'solid',
        ml: [-4, -5, -5, -6],
        mr: [-4, -5, 0, 0],
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
            transactions: router.pathname === '/transactions',
          }}
          setValues={(obj) => {
            if (obj.projects) {
              router.push('/')
            } else if (obj.transactions) {
              router.push('/transactions')
            }
          }}
        />
      </Flex>
    </Box>
  )
}

export default ViewHeading
