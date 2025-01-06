import { Box, Flex, IconButton } from 'theme-ui'
import { useState } from 'react'
import AnimateHeight from 'react-animate-height'

const IconWrapper = ({ children, Icon, content, mt = '8px', sx }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
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
              '&:hover > #icon': {
                stroke: 'primary',
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
              stroke: expanded ? 'primary' : 'secondary',
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
        <Box sx={{ my: 1 }}>{content}</Box>
      </AnimateHeight>
    </>
  )
}

export default IconWrapper
