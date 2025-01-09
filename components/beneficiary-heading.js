import { Input } from '@carbonplan/components'
import { useEffect, useState } from 'react'
import { Box } from 'theme-ui'

import IconWrapper from './icon-wrapper'
import { useQueries } from './queries'

const SearchCircle = ({ ...props }) => {
  const style = { vectorEffect: 'non-scaling-stroke' }

  return (
    <Box
      as='svg'
      viewBox='0 0 24 24'
      fill='none'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='1.5'
      {...props}
    >
      <path
        style={style}
        d='M12 23.0769C18.1176 23.0769 23.0769 18.1176 23.0769 12C23.0769 5.88239 18.1176 0.92308 12 0.92308C5.88239 0.92308 0.92308 5.88239 0.92308 12C0.92308 18.1176 5.88239 23.0769 12 23.0769Z'
      />
      <path style={style} d='M7 17L11 13' />
      <path
        style={style}
        d='M13.5 14C15.433 14 17 12.433 17 10.5C17 8.567 15.433 7 13.5 7C11.567 7 10 8.567 10 10.5C10 12.433 11.567 14 13.5 14Z'
      />
    </Box>
  )
}

const BeneficiaryHeading = ({ sx, color }) => {
  const { beneficiarySearch, setBeneficiarySearch } = useQueries()
  const [value, setValue] = useState(beneficiarySearch)

  // Store input value in component state for performance reasons,
  // but update context via useEffect here.
  useEffect(() => {
    setBeneficiarySearch(value)
  }, [value])

  return (
    <IconWrapper
      sx={sx}
      buttonBehavior
      Icon={SearchCircle}
      color={color}
      onClose={() => setValue('')}
      content={
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='enter search term'
          name='beneficiary search'
          color={color}
          size='xs'
          sx={{
            fontSize: 1,
            fontFamily: 'mono',
            width: '100%',
            borderBottom: 0,
          }}
        />
      }
    >
      Beneficiary
    </IconWrapper>
  )
}

export default BeneficiaryHeading
