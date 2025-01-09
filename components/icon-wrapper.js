import { Box, Flex, IconButton } from 'theme-ui'
import { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { X } from '@carbonplan/icons'

const IconWrapper = ({
  children,
  Icon,
  content,
  onClose,
  buttonBehavior = false,
  color = 'primary',
  mt = '8px',
  sx,
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Flex
        {...(buttonBehavior
          ? { role: 'button', onClick: () => setExpanded(!expanded) }
          : {})}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          ...(buttonBehavior
            ? {
                cursor: 'pointer',
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover  #icon': {
                    stroke: color,
                  },
                },
              }
            : {}),
          ...sx,
        }}
      >
        {children}
        <IconButton
          onClick={() => setExpanded(!expanded)}
          role='checkbox'
          aria-checked={expanded}
          aria-label='Information'
          sx={{
            cursor: 'pointer',
            height: '16px',
            width: '16px',
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover #icon': {
                stroke: color,
              },
            },
            p: [0],
            transform: 'translate(0px, -3.75px)',
            mt,
            flexShrink: 0,
          }}
        >
          <Icon
            id='icon'
            height='16px'
            width='16px'
            sx={{
              stroke: expanded ? color : 'secondary',
              transition: '0.1s',
            }}
          />
        </IconButton>
      </Flex>
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
