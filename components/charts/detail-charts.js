import { Box, Flex, Badge } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const DetailCharts = ({ issued, retired, isLoading, error }) => {
  return (
    <Box sx={{ my: 3 }}>
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
            <Badge sx={{ color: 'primary', background: 'muted', fontSize: 2 }}>
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
  )
}
export default DetailCharts
