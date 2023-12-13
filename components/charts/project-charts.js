import { Column, Row, Badge } from '@carbonplan/components'
import { useMemo, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import AnimateHeight from 'react-animate-height'
import { alpha } from '@theme-ui/color'

import { LABELS, COLORS } from '../constants'
import useFetcher from '../use-fetcher'
import CategoryBar from './category-bar'
import { formatValue } from '../utils'

const ProjectCharts = () => {
  const [expanded, setExpanded] = useState(false)
  const { data, error, isLoading } = useFetcher(
    'charts/credits_by_category',
    {}
  )

  const { issued, retired } = useMemo(() => {
    const empty = {
      issued: { total: 0, mapping: {} },
      retired: { total: 0, mapping: {} },
    }
    if (!data) {
      return empty
    }

    return data.data.reduce(
      (
        { issued: prevIssued, retired: prevRetired },
        { category, retired, issued }
      ) => {
        const key = LABELS.category[category] ? category : 'other'
        prevIssued.mapping[key] = prevIssued.mapping[key]
          ? prevIssued.mapping[key] + issued
          : issued
        prevRetired.mapping[key] = prevRetired.mapping[key]
          ? prevRetired.mapping[key] + retired
          : retired
        return {
          issued: {
            total: prevIssued.total + issued,
            mapping: prevIssued.mapping,
          },
          retired: {
            total: prevRetired.total + retired,
            mapping: prevRetired.mapping,
            issuedTotal: prevIssued.total + issued,
          },
        }
      },
      empty
    )
  }, [data])

  return (
    <>
      <Row
        onClick={() => setExpanded(!expanded)}
        columns={[6, 8, 8, 8]}
        sx={{
          mt: 6,
          color: 'primary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          cursor: 'pointer',
          '&:hover #expander': {
            stroke: 'primary',
          },
        }}
      >
        <Column start={1} width={[6, 8, 8, 8]}>
          <CategoryBar
            label='Credits issued'
            {...issued}
            expanded={expanded}
            showExpander={true}
          />
        </Column>
      </Row>
      <Row
        onClick={() => setExpanded(!expanded)}
        columns={[6, 8, 8, 8]}
        sx={{
          color: 'primary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          cursor: 'pointer',
          '&:hover #expander': {
            stroke: 'primary',
          },
        }}
      >
        <Column start={1} width={[6, 8, 8, 8]}>
          <CategoryBar
            label='Credits retired'
            {...retired}
            expanded={expanded}
          />
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
                    <Badge>
                      {formatValue(retired.mapping[l] ?? 0)}/
                      {formatValue(issued.mapping[l])}
                    </Badge>
                  </Flex>
                  <Box
                    sx={{
                      height: '5px',
                      width: '100%',
                      transition: 'background 0.2s',
                      background:
                        Object.keys(issued.mapping).length === 0
                          ? 'muted'
                          : (theme) => {
                              const issuedPercent =
                                ((issued.mapping[l] ?? 0) / issued.total) * 100
                              const retiredPercent =
                                ((retired.mapping[l] ?? 0) / issued.total) * 100
                              return `linear-gradient(to right, 
                                ${theme.rawColors[COLORS[l]]} 0%, 
                                ${
                                  theme.rawColors[COLORS[l]]
                                } ${retiredPercent}%, 
                                ${alpha(
                                  theme.rawColors[COLORS[l]],
                                  0.5
                                )(theme)} ${retiredPercent}%, 
                                ${alpha(
                                  theme.rawColors[COLORS[l]],
                                  0.5
                                )(theme)} ${issuedPercent}%, 
                                ${theme.colors.muted} ${issuedPercent}%, 
                                ${theme.colors.muted} 100%)`
                            },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </AnimateHeight>
        </Column>
      </Row>
    </>
  )
}

export default ProjectCharts
