import { alpha } from '@theme-ui/color'
import { useMemo } from 'react'
import { Box } from 'theme-ui'
import TableRow from './table-row'

const Loading = ({ values }) => {
  const rowValues = useMemo(
    () =>
      values.map((v) => ({
        ...v,
        label: (
          <Box sx={{ height: '28px', backgroundColor: alpha('muted', 0.4) }} />
        ),
      })),
    [values]
  )
  return (
    <>
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
      <TableRow values={rowValues} />
    </>
  )
}

export default Loading
