import { Button } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'

const BackButton = ({ href = '/projects', sx }) => {
  return (
    <Button
      inverted
      size='xs'
      onClick={() => {
        if (window.history.state?.idx) {
          window.history.back()
        } else {
          window.location.href = href
        }
      }}
      prefix={<Left />}
      sx={sx}
    >
      Back
    </Button>
  )
}

export default BackButton
