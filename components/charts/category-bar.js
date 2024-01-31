import { Row, Column, Expander } from '@carbonplan/components'
import { useMemo } from 'react'
import { Box, Flex } from 'theme-ui'

import { COLORS, LABELS } from '../constants'
import Quantity from '../quantity'

const CategoryBar = ({
  label,
  total,
  mapping,
  issuedTotal,
  expanded,
  showExpander,
}) => {
  const background = useMemo(() => {
    if (Object.keys(mapping).length === 0 || total === 0) {
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
          start={1}
          width={8}
          sx={{ mt: [!showExpander ? 5 : 0, 0, 0, 0] }} //add space when stacked
        >
          <Flex sx={{ gap: 3, alignItems: 'flex-end' }}>
            <Box
              sx={{
                fontSize: [1, 1, 1, 2],
                fontFamily: 'mono',
                letterSpacing: 'mono',
                color: 'secondary',
              }}
            >
              {label}
            </Box>
            <Quantity
              sx={{ fontSize: 4, height: ['34px'], px: 1, mb: '-2px' }}
              value={isEmpty ? '-' : total}
            />
          </Flex>
        </Column>
      </Row>
      <Row
        columns={1}
        sx={{
          mt: 5,
        }}
      >
        <Column
          start={1}
          width={8}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {showExpander && (
            <Expander
              value={expanded}
              id='expander'
              sx={{
                display: ['none', 'block', 'block', 'block'],
                ml: [-3, -4, -5, -5],
                width: [18, 22, 22, 22],
                position: 'absolute',
                mt: 1,
              }}
            />
          )}
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
    </>
  )
}

export default CategoryBar
