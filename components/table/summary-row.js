import { Badge } from '@carbonplan/components'
import { format } from 'd3-format'
import { Box } from 'theme-ui'

import TableRow from './table-row'

const formatter = (value) => {
  return value > 10000 ? format('.3s')(value) : value
}

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
                Count: <Badge>{formatter(count)}</Badge> /{' '}
                <Badge>{formatter(total)}</Badge> {label}
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
