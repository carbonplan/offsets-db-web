import { Box, IconButton } from 'theme-ui'
import { useCallback, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { X } from '@carbonplan/icons'
import IconLabel from './icon-label'

const IconWrapper = ({
  children,
  Icon,
  content,
  onClose,
  initiallyExpanded = false,
  buttonBehavior = false,
  color = 'primary',
  sx,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded)

  const handleToggleExpanded = useCallback(() => {
    if (expanded && onClose) {
      onClose()
    }
    setExpanded(!expanded)
  }, [expanded, onClose])

  return (
    <>
      <IconLabel
        Icon={Icon}
        color={color}
        activated={expanded}
        onClick={handleToggleExpanded}
        buttonBehavior={buttonBehavior}
        sx={sx}
      >
        {children}
      </IconLabel>

      <AnimateHeight
        duration={100}
        height={expanded ? 'auto' : 0}
        easing={'linear'}
      >
        <Box sx={{ my: 1, position: 'relative' }}>
          {content}
          {onClose && (
            <IconButton
              onClick={() => {
                setExpanded(false)
                onClose()
              }}
              sx={{
                position: 'absolute',
                right: 0,
                bottom: -1,
                width: 22,
                color: 'secondary',
                cursor: 'pointer',
                '&:hover': { color: 'primary' },
              }}
            >
              <X />
            </IconButton>
          )}
        </Box>
      </AnimateHeight>
    </>
  )
}

export default IconWrapper
