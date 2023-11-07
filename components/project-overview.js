import { Button, Column, Row, Tag } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { Box, Flex } from 'theme-ui'

import { COLORS, LABELS } from './constants'

const Empty = ({ label = 'N/A' }) => {
  return <Box sx={{ color: 'secondary' }}>{label}</Box>
}

const ProjectOverview = ({ project, minWidth = 1 }) => {
  const {
    category,
    country,
    status,
    developer,
    protocol,
    is_compliance,
    proponent,
    project_url,
    registry,
  } = project
  const color = COLORS[category[0]] ?? COLORS.other

  const sx = {
    label: {
      color,
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
      mt: 5,
      mb: 2,
    },
    value: {
      fontFamily: 'faux',
      letterSpacing: 'faux',
      fontSize: 1,
    },
  }

  return (
    <>
      <Column start={[1]} width={[3, 2, minWidth, minWidth]}>
        <Box sx={sx.label}>Country</Box>
        <Box sx={sx.value}>{country}</Box>
      </Column>
      <Column
        start={[4, 3, minWidth + 1, minWidth + 1]}
        width={[3, 2, minWidth, minWidth]}
      >
        <Box sx={sx.label}>Status</Box>
        <Box sx={{ ...sx.value, textTransform: 'capitalize' }}>{status}</Box>
      </Column>
      <Column
        start={[1, 5, minWidth * 2 + 1, minWidth * 2 + 1]}
        width={[3, 2, minWidth, minWidth]}
      >
        <Box sx={sx.label}>Category</Box>
        <Box sx={sx.value}>
          {category.map((c) => (
            <Box
              key={c}
              sx={{
                textTransform: 'capitalize',
                width: 'fit-content',
              }}
            >
              {c.replace(/-/g, ' ')}
            </Box>
          ))}
        </Box>
      </Column>

      <Column start={[4, 1, 1, 1]} width={[3, 2, minWidth, minWidth]}>
        <Box sx={sx.label}>Protocol</Box>
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
        start={[1, 3, minWidth + 1, minWidth + 1]}
        width={[3, 2, minWidth, minWidth]}
      >
        <Box sx={sx.label}>Developer</Box>
        <Box sx={sx.value}>{developer ?? <Empty />}</Box>
      </Column>
      <Column
        start={[4, 5, minWidth * 2 + 1, minWidth * 2 + 1]}
        width={[3, 2, minWidth, minWidth]}
      >
        <Box sx={sx.label}>Proponent</Box>
        <Box sx={sx.value}>{proponent ?? <Empty />}</Box>
      </Column>

      <Column start={[1]} width={[3, 2, minWidth, minWidth]}>
        <Box sx={sx.label}>Compliance</Box>
        <Box sx={sx.value}>{is_compliance ? 'Yes' : 'No'}</Box>
      </Column>

      <Column
        start={[4, 3, minWidth + 1, minWidth + 1]}
        width={[3, 2, minWidth, minWidth]}
      >
        <Box sx={sx.label}>Registry</Box>
        <Box sx={sx.value}>
          <Button
            href={project_url}
            suffix={<RotatingArrow sx={{ mt: -1 }} />}
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
