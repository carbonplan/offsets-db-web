import { Badge } from '@carbonplan/components'
import { useCallback } from 'react'
import { Box } from 'theme-ui'
import { formatValue } from './utils'

const Quantity = ({ color, value, badge = true, sx, ...props }) => {
  const isNumber = typeof value === 'number'
  const handleCopy = useCallback(
    (event) => {
      event.preventDefault()
      if (event.clipboardData) {
        event.clipboardData.setData('text/plain', value.toString())
      }
    },
    [value]
  )

  const Component = badge ? Badge : Box

  return (
    <Component
      sx={{
        color,
        userSelect: isNumber ? 'all' : 'none',
        ...sx,
      }}
      {...props}
      onCopy={handleCopy}
    >
      {isNumber ? formatValue(value) : '-'}
    </Component>
  )
}

export default Quantity
