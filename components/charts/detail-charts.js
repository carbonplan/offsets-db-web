import { Box, Flex, Badge } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import { alpha } from '@theme-ui/color'
import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const DetailCharts = ({ issued, retired, isLoading, error }) => {
  const createRetIssGraph = (theme, l) => {
    const retiredPercent =
      ((retired.mapping[l] ?? 0) / (issued.mapping[l] ?? 1)) * 100
    return `linear-gradient(to right, 
        ${theme.rawColors[COLORS[l]]} 0%, 
        ${theme.rawColors[COLORS[l]]} ${retiredPercent}%, 
        ${alpha(theme.rawColors[COLORS[l]], 0.5)(theme)} ${retiredPercent}%, 
        ${alpha(theme.rawColors[COLORS[l]], 0.5)(theme)}100%)`
  }

  const createIssuedGraph = (theme, l) => {
    return `linear-gradient(to right, ${theme.colors[COLORS[l]]} 0% ${
      ((issued.mapping[l] ?? 0) / issued.total) * 100
    }%, ${theme.colors.muted} ${
      ((issued.mapping[l] ?? 0) / issued.total) * 100
    }% 100%)`
  }

  return (
    <>
      <Row columns={[6, 8, 8, 8]}>
        <Column
          start={[2, 3, 3, 3]}
          width={2}
          sx={{ justifyContent: 'end', display: 'flex', mb: 1 }}
        >
          <Badge
            sx={{
              color: 'secondary',
              background: 'muted',
              fontSize: 0,
            }}
          >
            issued
          </Badge>
        </Column>
        <Column
          start={[5, 6, 6, 6]}
          width={2}
          sx={{ justifyContent: 'end', display: 'flex', mb: 1 }}
        >
          <Badge
            sx={{
              color: 'secondary',
              background: 'muted',
              fontSize: 0,
            }}
          >
            ret/iss
          </Badge>
        </Column>
      </Row>
      <Row columns={[6, 8, 8, 8]} sx={{ mb: 4 }}>
        <Column start={[1, 2, 2, 2]} width={3}>
          {Object.keys(LABELS.category)
            .filter((l) => Boolean(issued.mapping[l]))
            .map((l) => (
              <Box key={l} sx={{ mb: 2 }}>
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                    fontSize: 1,
                    mb: 1,
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
                    <Box sx={{ fontSize: 0 }}>{LABELS.category[l]}</Box>
                  </Flex>
                  <Badge
                    sx={{
                      color: COLORS[l],
                      backgroundColor: alpha(COLORS[l], 0.3),
                      fontSize: 0,
                    }}
                  >
                    {formatValue(issued.mapping[l] ?? 0)}
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
                        : (theme) => createIssuedGraph(theme, l),
                  }}
                />
              </Box>
            ))}
        </Column>
        <Column start={[4, 5, 5, 5]} width={3}>
          {Object.keys(LABELS.category)
            .filter((l) => Boolean(issued.mapping[l]))
            .map((l) => (
              <Box key={l} sx={{ mb: 2 }}>
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                    fontSize: 1,
                    mb: 1,
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
                    <Box sx={{ fontSize: 0 }}>{LABELS.category[l]}</Box>
                  </Flex>
                  <Badge
                    sx={{
                      color: COLORS[l],
                      backgroundColor: alpha(COLORS[l], 0.3),
                      fontSize: 0,
                    }}
                  >
                    {formatValue(retired.mapping[l] ?? 0)}/
                    {formatValue(issued.mapping[l] ?? 0)}
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
                        : (theme) => createRetIssGraph(theme, l),
                  }}
                />
              </Box>
            ))}
        </Column>
      </Row>
    </>
  )
}
export default DetailCharts
