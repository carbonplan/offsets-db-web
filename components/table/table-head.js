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
          onClick={() =>
            setSort((prev) =>
              prev === value.value ? `-${value.value}` : value.value
            )
          }
        >
          <Triangle
            id={`${value.value}-triangle`}
            sx={{
              transition: 'stroke 0.15s',
              stroke: sort.includes(value.value) ? 'primary' : 'muted',
              fill: 'none',
              width: 10,
              height: 10,
              transform: sort == `-${value.value}` ? 'rotate(180deg)' : null,
            }}
          />
        </Box>
      )
    },
    [sort]
  )

  return (
    <Box as='thead'>
      <TableRow
        as='th'
        values={values}
        Button={Sort}
        sx={{
          border: 0,
          borderTop: '1px',
          borderBottom: '1px',
          borderColor: 'muted',
          borderStyle: 'solid',
          mb: 2,
          ml: [-4, -5, -5, -6],
          mr: [-4, -5, 0, 0],
          pr: [4, 5, 0, 0],
          pl: [4, 5, 5, 6],
          '& th': {
            color: 'primary',
            fontFamily: 'body',
            letterSpacing: 'body',
            mb: 2,
            mt: 2,
          },
        }}
      />
    </Box>
  )
}

export default TableHead
