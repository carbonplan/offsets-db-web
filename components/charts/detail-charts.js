import { useState, useEffect } from 'react'
import { Box, Flex } from 'theme-ui'
import { Row, Column, Badge } from '@carbonplan/components'
import { alpha } from '@theme-ui/color'
import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const DetailCharts = ({ issued, retired, isLoading, error }) => {
  const [previousCategories, setPreviousCategories] = useState([])

  useEffect(() => {
    if (!isLoading && !error) {
      setPreviousCategories(Object.keys(issued.mapping))
    }
  }, [isLoading, error])

  const createGradient = (theme, l, isRetired) => {
    const percent = ((issued.mapping[l] ?? 0) / issued.total) * 100
    const retiredPercent = isRetired
      ? ((retired.mapping[l] ?? 0) / issued.total) * 100
      : percent

    if (isRetired) {
      return `linear-gradient(to right, 
            ${theme.rawColors[COLORS[l]]} 0%, 
            ${theme.rawColors[COLORS[l]]} ${retiredPercent}%,
            ${alpha(
              theme.rawColors[COLORS[l]],
              0.3
            )(theme)} ${retiredPercent}%, 
            ${alpha(theme.rawColors[COLORS[l]], 0.3)(theme)} ${percent}%,
            ${theme.colors.muted} ${percent}%, 
            ${theme.colors.muted} 100%)`
    } else {
      return `linear-gradient(to right, ${
        theme.colors[COLORS[l]]
      } 0% ${percent}%, ${theme.colors.muted} ${percent}% 100%)`
    }
  }
  const chartColumn = (isRetired) => {
    const categoryKeys =
      isLoading || error
        ? previousCategories
        : Object.keys(LABELS.category).filter((l) => Boolean(issued.mapping[l]))

    return (
      <Column
        start={[
          isRetired ? 4 : 1,
          isRetired ? 5 : 1,
          isRetired ? 5 : 1,
          isRetired ? 5 : 1,
        ]}
        width={[3, 4, 4, 4]}
      >
        {categoryKeys.map((l) => (
          <Box key={l} sx={{ mb: 2 }}>
            <Flex
              sx={{
                justifyContent: 'space-between',
                fontSize: 2,
                mb: 1,
              }}
            >
              {isLoading || error ? (
                <Flex sx={{ gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'muted',
                    }}
                  />
                  <Box sx={{ fontSize: 1, color: 'muted' }}>----</Box>
                </Flex>
              ) : (
                <Flex sx={{ gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: COLORS[l],
                    }}
                  />
                  <Box sx={{ fontSize: [1, 1, 1, 2] }}>
                    {LABELS.category[l]}
                  </Box>
                </Flex>
              )}

              <Badge
                sx={{
                  color: isLoading || error ? 'primary' : COLORS[l],
                  backgroundColor:
                    isLoading || error ? 'muted' : alpha(COLORS[l], 0.3),
                }}
              >
                {isLoading || error
                  ? '-'
                  : formatValue(
                      isRetired ? retired.mapping[l] : issued.mapping[l]
                    ) ?? 0}
              </Badge>
            </Flex>
            <Box
              sx={{
                height: '5px',
                width: '100%',
                transition: 'background 0.2s',
                background:
                  isLoading || error
                    ? 'muted'
                    : (theme) => createGradient(theme, l, isRetired),
              }}
            />
          </Box>
        ))}
      </Column>
    )
  }

  return (
    <>
      <Row columns={[6, 8, 8, 8]} sx={{ mb: 5 }}>
        {chartColumn(false)}
        {chartColumn(true)}
      </Row>
    </>
  )
}

export default DetailCharts
