import { Triangle } from '@carbonplan/icons'
import { Box } from 'theme-ui'
import { useCallback } from 'react'
import TableRow from './table-row'

const TableHead = ({ values, sort, setSort }) => {
  const Sort = useCallback(
    ({ value }) => {
      return (
        <Box
          as='button'
          sx={{
            width: '16px',
            height: '16px',
            bg: 'transparent',
            border: 'none',
            p: 0,
            m: 0,
            mb: 1,
            display: 'block',
            cursor: 'pointer',
            '@media (hover: hover) and (pointer: fine)': {
              [`&:hover #${value.value}-triangle`]: {
                stroke: 'primary',
              },
            },
          }}
          onClick={() => setSort(value.value)}
        >
          <Triangle
            id={`${value.value}-triangle`}
            sx={{
              transition: 'stroke 0.15s',
              stroke: sort === value.value ? 'primary' : 'muted',
              fill: 'none',
              width: 10,
              height: 10,
            }}
          />
        </Box>
      )
    },
    [sort]
  )

  return (
    <Box
      as='thead'
      sx={{
        '& tr': {
          border: 0,
          borderBottom: '1px',
          borderColor: 'muted',
          borderStyle: 'solid',
          mb: 2,
          ml: [-4, -5, -5, -6],
          pl: [4, 5, 5, 6],
        },
      }}
    >
      <TableRow
        as='th'
        values={values}
        Button={Sort}
        sx={{
          color: 'primary',
          fontFamily: 'body',
          letterSpacing: 'body',
          mb: 2,
        }}
      />
    </Box>
  )
}

export default TableHead
