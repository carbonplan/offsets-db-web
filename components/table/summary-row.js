import { Badge } from '@carbonplan/components'
import { Box } from 'theme-ui'

import { formatValue } from '../utils'
import TableRow from './table-row'

const SummaryRow = ({ count, total, label }) => {
  return (
    <TableRow
      values={[
        {
          label: (
            <Box>
              <Box
                sx={{
                  color: 'secondary',
                  textTransform: 'uppercase',
                  fontFamily: 'mono',
                  letterSpacing: 'mono',
                }}
              >
                Count: <Badge>{formatValue(count)}</Badge> /{' '}
                <Badge>{formatValue(total)}</Badge> {label}
              </Box>
            </Box>
          ),
          key: 'count',
          width: [6, 8, 8, 8],
        },
      ]}
      sx={{
        border: 0,
        borderBottom: '1px',
        borderColor: 'muted',
        borderStyle: 'solid',
        mb: 2,
        ml: [-4, -5, -5, -6],
        mr: [-4, -5, 0, 0],
        pr: [4, 5, 0, 0],
        pl: [4, 5, 5, 6],
        '& td': {
          mb: 3,
          mt: 1,
        },
      }}
    />
  )
}

export default SummaryRow
