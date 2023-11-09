import { Box } from 'theme-ui'

import TableRow from './table-row'

const TableFoot = ({ values }) => {
  return (
    <Box as='tfoot' sx={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
      <TableRow
        sx={{
          border: 0,
          borderTop: '1px',
          borderColor: 'muted',
          borderStyle: 'solid',
          backgroundColor: 'background',
          ml: [-4, -5, -5, -6],
          mr: [-4, -5, 0, 0],
          pr: [4, 5, 0, 0],
          pl: [4, 5, 5, 6],
        }}
        values={values}
      />
    </Box>
  )
}

export default TableFoot
