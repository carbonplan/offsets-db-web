import { Button, Column } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { Box, Flex } from 'theme-ui'

import { COLORS, LABELS } from './constants'
import TooltipWrapper from './tooltip-wrapper'

const Empty = ({ label = 'N/A' }) => {
  return <Box>{label}</Box>
}

const ProjectOverview = ({ project, columns = 4 }) => {
  const {
    category,
    country,
    status,
    protocol,
    is_compliance,
    proponent,
    project_url,
    registry,
    project_type,
    project_type_source,
  } = project
  const color = COLORS[category[0]] ?? COLORS.other

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
      <Column start={[1]} width={[3, 2, 2, 2]}>
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Location of project'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Country</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{country}</Box>
      </Column>

      <Column start={[4, 3, 3, 3]} width={[3, 2, 2, 2]}>
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Stage in project lifecycle'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Status</Box>
        </TooltipWrapper>
        <Box sx={{ ...sx.value, textTransform: 'capitalize' }}>{status}</Box>
      </Column>

      <Column
        start={[1, 5, columns === 4 ? 1 : 5, columns === 4 ? 1 : 5]}
        width={[3, 2, 2, 2]}
      >
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Project category inferred from protocol(s)'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Category</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>
          {category.map((c) => (
            <Box key={c} sx={{ width: 'fit-content' }}>
              {LABELS.category[c]}
            </Box>
          ))}
        </Box>
      </Column>

      <Column
        start={[4, 1, columns === 4 ? 3 : 1, columns === 4 ? 3 : 1]}
        width={[3, 2, 2, 2]}
      >
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip={
            LABELS.project_type_source[project_type_source] ??
            LABELS.project_type_source.empty
          }
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Project type</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{project_type ?? <Empty />}</Box>
      </Column>

      <Column
        start={[1, 3, columns === 4 ? 1 : 3, columns === 4 ? 1 : 3]}
        width={[3, 2, 2, 2]}
      >
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Methodology used to issue credits'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Protocol</Box>
        </TooltipWrapper>
        <Box sx={{ ...sx.value, textTransform: 'uppercase' }}>
          {protocol.length > 0 ? (
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              {protocol.map((d) => (
                <Box key={d}>{d}</Box>
              ))}
            </Flex>
          ) : (
            <Empty />
          )}
        </Box>
      </Column>

      <Column
        start={[4, 5, columns === 4 ? 3 : 5, columns === 4 ? 3 : 5]}
        width={[3, 2, 2, 2]}
      >
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Project proponent listed on registry'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Proponent</Box>
        </TooltipWrapper>
        <Box sx={{ ...sx.value, mr: columns === 4 ? [0, 0, 2, 2] : 0 }}>
          {proponent ?? <Empty />}
        </Box>
      </Column>

      <Column start={[1, 1, 1, 1]} width={[3, 2, 2, 2]}>
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Whether project is enrolled in a compliance program'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Compliance</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>{is_compliance ? 'Yes' : 'No'}</Box>
      </Column>

      <Column start={[4, 3, 3, 3]} width={[3, 2, 2, 2]}>
        <TooltipWrapper
          top='-0.5px'
          color={color}
          tooltip='Link to project registry page'
          sx={sx.tooltipWrapper}
        >
          <Box sx={sx.label}>Registry</Box>
        </TooltipWrapper>
        <Box sx={sx.value}>
          <Button
            href={project_url}
            suffix={<RotatingArrow sx={{ mt: -1, height: 13, width: 13 }} />}
            sx={sx.value}
          >
            {LABELS.registry[registry]}
          </Button>
        </Box>
      </Column>
    </>
  )
}

export default ProjectOverview
