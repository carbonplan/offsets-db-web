import { Button } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { useRouter } from 'next/navigation'

const BackButton = ({ href = '/', sx }) => {
  const router = useRouter()

  return (
    <Button
      inverted
      size='xs'
      onClick={() => {
        router.push(href)
      }}
      prefix={<Left />}
      sx={sx}
    >
      Back
    </Button>
  )
}

export default BackButton
