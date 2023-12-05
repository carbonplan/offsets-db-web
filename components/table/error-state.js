import { Column, Row } from '@carbonplan/components'
import { Box } from 'theme-ui'

const ErrorState = ({ error, width }) => {
  return (
    <Row as='tr' columns={width}>
      <Column
        as={'td'}
        start={1}
        width={width}
        sx={{
          fontSize: 1,
          textAlign: 'left',
          color: 'secondary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          mb: 4,
          mt: 2,
        }}
      >
        <Box sx={{ width: '100%', mt: 2, minHeight: 800 }}>
          Error loading data{error?.message ? `: ${error?.message}` : ''}
        </Box>
      </Column>
    </Row>
  )
}

export default ErrorState
