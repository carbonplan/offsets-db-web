import { Badge, Expander } from '@carbonplan/components'
import { useMemo, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import AnimateHeight from 'react-animate-height'

import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const CategoryBar = ({ label, total, mapping }) => {
  const [expanded, setExpanded] = useState(false)

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
          let value = (mapValue / total) * 100
          if (accum[i - 1]) {
            value = value + accum[i - 1]
          }
          accum.push(value)
          return accum
        },
        []
      )

      return (theme) =>
        `linear-gradient(to right, ${percentages
          .map((p, i) => {
            const prev = percentages[i - 1] ?? 0
            return `${theme.colors[colors[i]]} ${prev}% ${p}%`
          })
          .join(', ')})`
    }
  }, [total, mapping])

  const isEmpty = Object.keys(mapping).length === 0

  return (
    <Box sx={{ mt: 3, mb: 6 }}>
      <Flex sx={{ gap: 3, alignItems: 'flex-end' }}>
        <Box
          sx={{ fontFamily: 'mono', letterSpacing: 'mono', color: 'secondary' }}
        >
          {label}
        </Box>
        <Badge sx={{ fontSize: 4, height: ['34px'], px: 1, mb: '-2px' }}>
          {isEmpty ? '-' : formatValue(total)}
        </Badge>
      </Flex>

      <Box sx={{ mt: 4, position: 'relative' }}>
        <Expander
          value={expanded}
          onClick={() => setExpanded(!expanded)}
          sx={{
            position: 'absolute',
            left: '-22px',
            width: '18px',
            height: '18px',
          }}
        />
        <Box
          sx={{
            width: '100%',
            height: '28px',
            transition: 'background 0.2s',
            background,
          }}
        />
      </Box>

      <AnimateHeight
        duration={100}
        height={expanded ? 'auto' : 0}
        easing={'linear'}
      >
        <Box sx={{ mt: 3 }}>
          {Object.keys(LABELS.category).map((l) => (
            <Box key={l} sx={{ mb: 2 }}>
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  fontSize: 1,
                  mb: 2,
                }}
              >
                <Flex sx={{ gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: COLORS[l],
                    }}
                  />
                  {LABELS.category[l]}
                </Flex>
                <Badge>{isEmpty ? '-' : formatValue(mapping[l] ?? 0)}</Badge>
              </Flex>
              <Box
                sx={{
                  height: '5px',
                  width: '100%',
                  transition: 'background 0.2s',
                  background: isEmpty
                    ? 'muted'
                    : (theme) =>
                        `linear-gradient(to right, ${
                          theme.colors[COLORS[l]]
                        } 0% ${((mapping[l] ?? 0) / total) * 100}%, ${
                          theme.colors.muted
                        } ${((mapping[l] ?? 0) / total) * 100}% 100%)`,
                }}
              />
            </Box>
          ))}
        </Box>
      </AnimateHeight>
    </Box>
  )
}

export default CategoryBar
