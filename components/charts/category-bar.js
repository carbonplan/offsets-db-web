import { Badge } from '@carbonplan/components'
import { format } from 'd3-format'
import { Box, Flex } from 'theme-ui'

import { COLORS, LABELS } from '../constants'
import { formatValue } from '../utils'

const CategoryBar = ({ label, total, mapping }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Flex sx={{ gap: 3, alignItems: 'flex-end' }}>
        <Box
          sx={{ fontFamily: 'mono', letterSpacing: 'mono', color: 'secondary' }}
        >
          {label}
        </Box>
        <Badge sx={{ fontSize: 4, height: ['34px'], px: 1, mb: '-2px' }}>
          {formatValue(total)}
        </Badge>
      </Flex>

      <Flex sx={{ height: '20px', mt: 3 }}>
        {Object.keys(LABELS.category).map((l) => (
          <Box
            key={l}
            sx={{
              height: '20px',
              width: `${(mapping[l] / total) * 100}%`,
              backgroundColor: COLORS[l],
            }}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default CategoryBar
