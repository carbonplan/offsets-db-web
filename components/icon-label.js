import { Flex, IconButton } from 'theme-ui'

const IconLabel = ({
  children,
  Icon,
  onClick,
  activated = false,
  buttonBehavior = false,
  color = 'primary',
  mt = '8px',
  sx,
}) => {
  return (
    <Flex
      {...(buttonBehavior ? { role: 'button', onClick } : {})}
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
        onClick={onClick}
        role='checkbox'
        aria-checked={activated}
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
            stroke: activated ? color : 'secondary',
            transition: '0.1s',
          }}
        />
      </IconButton>
    </Flex>
  )
}

export default IconLabel
