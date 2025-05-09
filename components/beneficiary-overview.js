import { Column } from '@carbonplan/components'
import { Box } from 'theme-ui'

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
      mr: 2,
    },
    tooltipWrapper: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 1,
      width: 'fit-content',
      '& svg': { stroke: color },
    },
  }

  const width = columns / 2

  return (
    <>
      <Column start={[1, 3, 3, 3]} width={[3, width, width, width]}>
        <TooltipWrapper
          color={color}
          tooltip='Note specifically designating the entity claiming a credit’s environmental benefits.'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Retirement user</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_beneficiary ?? <Empty />}</Box>
      </Column>

      <Column
        start={[4, 3 + width, 3 + width, 3 + width]}
        width={[3, width, width, width]}
      >
        <TooltipWrapper
          color={color}
          tooltip='Name on account from which credits were retired.'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Retirement account</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_account ?? <Empty />}</Box>
      </Column>

      <Column start={[1, 3, 3, 3]} width={[3, width, width, width]}>
        <TooltipWrapper
          color={color}
          tooltip='Short-form text accompanying credit retirement.'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Retirement note</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_note ?? <Empty />}</Box>
      </Column>

      <Column
        start={[4, 3 + width, 3 + width, 3 + width]}
        width={[3, width, width, width]}
      >
        <TooltipWrapper
          color={color}
          tooltip='Short-form text specifying why credits were retired (e.g., compliance purposes). Sometimes similar to a retirement note.'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Retirement reason</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{retirement_reason ?? <Empty />}</Box>
      </Column>
    </>
  )
}

export default BeneficiaryOverview
