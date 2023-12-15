import { Box, Flex, Badge } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import { alpha } from '@theme-ui/color'
import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const DetailCharts = ({ issued, retired, isLoading, error }) => {
  const createGraphs = (theme, l) => {
    const retiredPercent =
      ((retired.mapping[l] ?? 0) / (issued.mapping[l] ?? 1)) * 100
    return `linear-gradient(to right, 
        ${theme.rawColors[COLORS[l]]} 0%, 
        ${theme.rawColors[COLORS[l]]} ${retiredPercent}%, 
        ${alpha(theme.rawColors[COLORS[l]], 0.5)(theme)} ${retiredPercent}%, 
        ${alpha(theme.rawColors[COLORS[l]], 0.5)(theme)}100%)`
  }

  return (
    <>
      <Row columns={[6, 8, 8, 8]} sx={{}}>
        <Column
          start={[4, 6, 6, 6]}
          width={2}
          sx={{ justifyContent: 'end', display: 'flex', mb: 2 }}
        >
          <Badge
            sx={{
              color: 'secondary',
              background: 'muted',
              fontSize: 2,
            }}
          >
            ret/iss
          </Badge>
        </Column>
      </Row>
      <Row columns={[6, 8, 8, 8]} sx={{ mb: 4 }}>
        <Column start={[1, 2, 2, 2]} width={6}>
          {Object.keys(LABELS.category)
            .filter((l) => Boolean(issued.mapping[l]))
            .map((l) => (
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
                  <Badge
                    sx={{
                      color: COLORS[l],
                      backgroundColor: alpha(COLORS[l], 0.3),
                      fontSize: [1, 2, 2, 2],
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
                        : (theme) => createGraphs(theme, l),
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
