import React from 'react'
import { Box } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import { PoopSad } from '@carbonplan/emoji'

const CustomTimeout = () => {
  return (
    <Row sx={{ mb: [5, 0, 0], pt: [0, 0, 6] }}>
      <Column start={[1, 1, 3, 3]} width={[6, 4, 4, 4]}>
        <Box as='h1' variant='styles.h1'>
          Oops!
        </Box>
        <Box
          sx={{
            fontSize: [4, 4, 4, 5],
            lineHeight: 'h3',
            mt: [3, 4, 4],
            mb: [2, 3, 3],
            maxWidth: ['90%', '90%', '400px'],
          }}
        >
          The request timed out.
        </Box>
        <Box
          sx={{
            color: 'secondary',
            fontFamily: 'mono',
            letterSpacing: 'mono',
            fontSize: [2, 2, 2, 3],
            mt: [4, 5, 5],
          }}
        >
          ERROR CODE 504
        </Box>
      </Column>
      <Column start={[2, 5, 7, 7]} width={[4, 4, 4, 4]}>
        <Box
          sx={{
            width: ['100%'],
            mt: [2, 4, 4, 5],
            fill: 'primary',
          }}
        >
          <PoopSad sx={{ width: '100%', height: 'auto' }} />
        </Box>
      </Column>
    </Row>
  )
}

export default CustomTimeout