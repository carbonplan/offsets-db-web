import { alpha } from '@theme-ui/color'
import { useMemo } from 'react'
import { Box } from 'theme-ui'
import TableRow from './table-row'

const Loading = ({ columns, values }) => {
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
      {Array(10)
        .fill(null)
        .map((d, i) => (
          <TableRow key={i} values={rowValues} columns={columns} />
        ))}
    </>
  )
}

export default Loading
