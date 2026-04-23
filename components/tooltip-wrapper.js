import { Box } from 'theme-ui'
import { Info } from '@carbonplan/icons'
import IconWrapper from './icon-wrapper'

const TooltipWrapper = ({ Icon = Info, children, tooltip, color, sx, top }) => {
  return (
    <IconWrapper
      Icon={Icon}
      content={
        <Box sx={{ my: 1, fontSize: [1, 1, 1, 2], color }}>{tooltip}</Box>
      }
      sx={sx}
      top={top}
    >
      {children}
    </IconWrapper>
  )
}

export default TooltipWrapper
