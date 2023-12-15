import { Badge, Row, Column } from '@carbonplan/components'
import { useMemo } from 'react'
import { Box } from 'theme-ui'

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
        percentages.push(100)
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
    <>
      <Row columns={[6, 8, 8, 8]}>
        <Column
          start={[1, 2, 2, 2]}
          width={2}
          sx={{
            fontSize: 1,
            fontFamily: 'mono',
            letterSpacing: 'mono',
            color: 'secondary',
            ml: [3, 0, 0, 0],
          }}
        >
          <Badge
            sx={{
              fontSize: [3, 4, 4, 4],
              height: ['34px'],
              width: 'fit-content',
              height: 'fit-content',
              px: 1,
              mr: 4,
            }}
          >
            {isEmpty ? '-' : formatValue(total)}
          </Badge>
        </Column>

        <Column
          start={[3, 4, 4, 4]}
          width={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '28px',
              transition: 'background 0.2s',
              background,
            }}
          />
        </Column>
      </Row>
      <Row
        columns={[6, 8, 8, 8]}
        sx={{
          mb: 3,
          ml: [3, 0, 0, 0],
        }}
      >
        <Column start={[1, 2, 2, 2]} width={1}>
          <Box sx={{ my: 1, width: '145px', fontSize: [0, 1, 1, 1] }}>
            {label}
          </Box>
        </Column>
      </Row>
    </>
  )
}

export default CategoryBar
