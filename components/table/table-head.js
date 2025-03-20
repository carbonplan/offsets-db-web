import { Triangle } from '@carbonplan/icons'
import { Box } from 'theme-ui'
import { useCallback } from 'react'
import TableRow from './table-row'

const SORTS = {
  project_id: {
    primary: 'project_id',
    inverted: '-project_id',
  },
  name: {
    primary: 'name',
    inverted: '-name',
  },
  listed_at: {
    primary: '-listed_at',
    inverted: 'listed_at',
  },
  issued: {
    primary: '-issued',
    inverted: 'issued',
  },
  retired: {
    primary: '-retired',
    inverted: 'retired',
  },
  transaction_date: {
    primary: '-transaction_date',
    inverted: 'transaction_date',
  },
  vintage: { primary: '-vintage', inverted: 'vintage' },
  transaction_type: {
    primary: 'transaction_type',
    inverted: '-transaction_type',
  },
  quantity: { primary: '-quantity', inverted: 'quantity' },
}

const TableHead = ({
  color,
  values,
  sort,
  setSort,
  borderTop,
  sx,
  columns,
}) => {
  const Sort = useCallback(
    ({ value }) => {
      if (!SORTS[value.value]) {
        return <Box sx={{ height: '16px', mb: 1 }} />
      }
      const { primary, inverted } = SORTS[value.value]
      const activeColor = color ?? 'primary'
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
                stroke: activeColor,
              },
            },
          }}
          onClick={() =>
            setSort((prev) => (prev === primary ? inverted : primary))
          }
        >
          <Triangle
            id={`${value.value}-triangle`}
            sx={{
              transition: 'stroke 0.15s',
              stroke: sort.includes(value.value) ? activeColor : 'muted',
              fill: 'none',
              width: 10,
              height: 10,
              transform: sort == inverted ? 'rotate(180deg)' : null,
            }}
          />
        </Box>
      )
    },
    [sort, color]
  )

  return (
    <Box
      as='thead'
      sx={{
        position: 'sticky',
        top: 55 + 61,
        zIndex: 1,
        ...sx,
      }}
    >
      <TableRow
        as='th'
        values={values}
        columns={columns}
        Button={Sort}
        sx={{
          border: 0,
          borderTop: borderTop ? '1px' : 0,
          background: 'background',
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
            pb: 1,
            mt: 2,
          },
        }}
      />
    </Box>
  )
}

export default TableHead
