import { Box, Flex, IconButton } from 'theme-ui'
import { Tag } from '@carbonplan/components'
import { Left, Right } from '@carbonplan/icons'
import { useRef } from 'react'

const sx = {
  arrow: {
    p: 0,
    alignItems: 'flex-start',
    cursor: 'pointer',
    mt: 1,
    '&:disabled': {
      cursor: 'inherit',
    },

    '& svg': {
      height: [14, 14, 14, 16],
    },
    '&:disabled svg': {
      color: 'muted',
    },
  },
}

const Pagination = ({
  color = 'primary',
  pagination: paginationProp,
  isLoading,
  setPage,
}) => {
  const pagination = useRef({})
  pagination.current = paginationProp ?? pagination.current
  const {
    total_entries = 0,
    current_page = 1,
    total_pages = 1,
  } = pagination.current

  if (total_entries === 0) {
    return null
  }

  let tags = []

  if (total_pages < 8) {
    tags = Array(total_pages)
      .fill(null)
      .map((d, i) => i + 1)
  } else if (current_page <= 4) {
    tags = [1, 2, 3, 4, 5, 6, '...', total_pages]
  } else if (total_pages - current_page <= 4) {
    tags = [
      1,
      '...',
      ...Array(6)
        .fill(null)
        .map((d, i) => total_pages - 5 + i),
    ]
  } else {
    tags = [
      1,
      '...',
      ...Array(5)
        .fill(null)
        .map((d, i) => current_page - 2 + i),
      '...',
      total_pages,
    ]
  }

  return (
    <Flex sx={{ gap: 1, mt: 1 }}>
      <IconButton
        sx={sx.arrow}
        disabled={current_page === 1}
        onClick={() => setPage(current_page - 1)}
      >
        <Left />
      </IconButton>
      <Flex sx={{ alignItems: 'flex-start', gap: 3 }}>
        {tags.map((t, i) =>
          typeof t === 'number' ? (
            <Tag
              key={t}
              value={current_page === t}
              onClick={() => setPage(t)}
              disabled={isLoading}
              sx={{ color }}
            >
              {t}
            </Tag>
          ) : (
            <Box key={`${t}-${i}`} sx={{ color: 'secondary' }}>
              {t}
            </Box>
          )
        )}
      </Flex>
      <IconButton
        sx={sx.arrow}
        disabled={current_page === total_pages}
        onClick={() => setPage(current_page + 1)}
      >
        <Right />
      </IconButton>
    </Flex>
  )
}

export default Pagination
