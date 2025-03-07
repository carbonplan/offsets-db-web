import { useState, useEffect } from 'react'
import { Box, Flex } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import { alpha } from '@theme-ui/color'

import { COLORS, LABELS } from '../constants'
import Quantity from '../quantity'

const ChartColumn = ({
  categoryKeys,
  mapping,
  baseTotal,
  baseMapping,
  ready,
  start,
}) => {
  const createGradient = (theme, l) => {
    const percent = ((mapping[l] ?? 0) / baseTotal) * 100
    if (baseMapping) {
      const basePercent = ((baseMapping[l] ?? 0) / baseTotal) * 100
      return `linear-gradient(to right, 
            ${theme.rawColors[COLORS[l]]} 0%, 
            ${theme.rawColors[COLORS[l]]} ${percent}%,
            ${alpha(theme.rawColors[COLORS[l]], 0.3)(theme)} ${percent}%, 
            ${alpha(theme.rawColors[COLORS[l]], 0.3)(theme)} ${basePercent}%,
            ${theme.colors.muted} ${basePercent}%, 
            ${theme.colors.muted} 100%)`
    } else {
      return `linear-gradient(to right, ${
        theme.colors[COLORS[l]]
      } 0% ${percent}%, ${theme.colors.muted} ${percent}% 100%)`
    }
  }

  return (
    <Column start={start} width={[3, 4, 4, 4]} sx={{ ml: '2px' }}>
      {categoryKeys.map((l) => (
        <Box key={l} sx={{ mb: 2 }}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              fontSize: 2,
              mb: [1, 1, 1, 2],
            }}
          >
            {!ready ? (
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
                <Box sx={{ fontSize: [1, 1, 1, 2] }}>{LABELS.category[l]}</Box>
              </Flex>
            )}

            <Quantity
              color={!ready ? null : COLORS[l]}
              value={!ready ? '-' : mapping[l] ?? 0}
            />
          </Flex>
          <Box
            sx={{
              height: '5px',
              width: '100%',
              transition: 'background 0.2s',
              background: !ready
                ? 'muted'
                : (theme) => createGradient(theme, l),
            }}
          />
        </Box>
      ))}
    </Column>
  )
}

const DetailCharts = ({ issued, retired, isLoading, error }) => {
  const [previousCategories, setPreviousCategories] = useState([])

  const base = Object.keys(issued.mapping).length === 0 ? retired : issued
  let categoryKeys = Object.keys(LABELS.category).filter((l) =>
    Boolean(base.mapping[l])
  )

  useEffect(() => {
    if (!isLoading && !error) {
      setPreviousCategories(categoryKeys)
    }
  }, [isLoading, error])

  if (isLoading || error) {
    categoryKeys = previousCategories
  }

  return (
    <>
      <Row columns={[6, 8, 8, 8]} sx={{ mb: 5 }}>
        <ChartColumn
          categoryKeys={categoryKeys}
          mapping={issued.mapping}
          baseTotal={base.total}
          ready={!isLoading && !error && Object.keys(issued.mapping).length > 0}
          start={1}
        />
        <ChartColumn
          categoryKeys={categoryKeys}
          mapping={retired.mapping}
          baseTotal={base.total}
          baseMapping={base.mapping}
          ready={!isLoading && !error}
          start={[4, 5, 5, 5]}
        />
      </Row>
    </>
  )
}

export default DetailCharts
