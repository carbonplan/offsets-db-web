import { Button, Column } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { Box, Flex } from 'theme-ui'

import TooltipWrapper from './tooltip-wrapper'
import { alpha } from '@theme-ui/color'

const Empty = ({ label = 'None listed' }) => {
  return <Box sx={{ color: alpha('primary', 0.3) }}>{label}</Box>
}

const BeneficiaryOverview = ({ event, color, columns = 4 }) => {
  const {
    retirement_account,
    retirement_beneficiary,
    retirement_note,
    retirement_reason,
  } = event

  const sx = {
    label: {
      color,
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
    },
    value: {
      fontFamily: 'faux',
      letterSpacing: 'faux',
      fontSize: 1,
      mt: 2,
      mb: 5,
    },
    tooltipWrapper: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 1,
      width: 'fit-content',
      '& svg': { stroke: color },
    },
  }

  return (
    <>
      <Column start={[1, 3, 3, 3]} width={[3]}>
        <TooltipWrapper color={color} tooltip='TK' sx={sx.tooltipWrapper}>
          <Box sx={sx.label}>Retirement account</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_account ?? <Empty />}</Box>
      </Column>

      <Column start={[4, 6, 6, 6]} width={[3]}>
        <TooltipWrapper color={color} tooltip='TK' sx={sx.tooltipWrapper}>
          <Box sx={sx.label}>Retirement beneficiary</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_beneficiary ?? <Empty />}</Box>
      </Column>

      <Column
        start={[1, 3, columns === 4 ? 1 : 3, columns === 4 ? 1 : 3]}
        width={3}
      >
        <TooltipWrapper color={color} tooltip='TK' sx={sx.tooltipWrapper}>
          <Box sx={sx.label}>Retirement note</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_note ?? <Empty />}</Box>
      </Column>

      <Column
        start={[4, 1, columns === 4 ? 3 : 6, columns === 4 ? 3 : 3]}
        width={3}
      >
        <TooltipWrapper color={color} tooltip='TK' sx={sx.tooltipWrapper}>
          <Box sx={sx.label}>Retirement reason</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_reason ?? <Empty />}</Box>
      </Column>
    </>
  )
}

export default BeneficiaryOverview
