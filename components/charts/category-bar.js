import { Badge, Expander } from '@carbonplan/components'
import { useMemo } from 'react'
import { Box, Flex } from 'theme-ui'

import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const CategoryBar = ({ label, total, mapping, issuedTotal }) => {
  const background = useMemo(() => {
    if (Object.keys(mapping).length === 0) {
      return 'muted'
    } else {
      const colors = Object.keys(LABELS.category).map((key) => COLORS[key])
      const percentages = Object.keys(LABELS.category).reduce(
        (accum, key, i) => {
          let mapValue = mapping[key]
          if (typeof mapValue !== 'number') {
            mapValue = 0
          }
          let value = (mapValue / (issuedTotal ?? total)) * 100
          if (accum[i - 1]) {
            value = value + accum[i - 1]
          }
          accum.push(value)
          return accum
        },
        []
      )
      if (issuedTotal) {
        colors.push('muted')
        percentages.push((issuedTotal / total) * 100)
      }

      return (theme) =>
        `linear-gradient(to right, ${percentages
          .map((p, i) => {
            const prev = percentages[i - 1] ?? 0
            return `${theme.colors[colors[i]]} ${prev}% ${p}%`
          })
          .join(', ')})`
    }
  }, [total, issuedTotal, mapping])

  const isEmpty = Object.keys(mapping).length === 0

  return (
    <Box sx={{ mb: 6 }}>
      <Flex sx={{ gap: 3, alignItems: 'center' }}>
        <Box
          sx={{
            fontSize: 1,
            fontFamily: 'mono',
            letterSpacing: 'mono',
            color: 'secondary',
          }}
        >
          {label}
        </Box>
        <Box>
          <Badge
            sx={{
              fontSize: 4,
              height: ['34px'],
              width: 'fit-content',
              px: 1,
              mr: 4,
            }}
          >
            {isEmpty ? '-' : formatValue(total)}
          </Badge>
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '28px',
            transition: 'background 0.2s',
            background,
          }}
        />
      </Flex>
    </Box>
  )
}

export default CategoryBar
