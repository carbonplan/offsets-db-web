import {
  Badge,
  Button,
  Column,
  Expander,
  formatDate,
  Row,
  Tag,
} from '@carbonplan/components'
import { RotatingArrow, XCircle } from '@carbonplan/icons'
import { alpha } from '@theme-ui/color'
import { useState } from 'react'
import { Box, IconButton } from 'theme-ui'
import { keyframes } from '@emotion/react'
import { format } from 'd3-format'

import { COLORS, LABELS } from './constants'
import { TableRow } from './table'

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const sx = {
  expanded: {
    background: alpha('muted', 0.5),
    py: 1,
    mb: 3,
    ml: [-4, -5, -5, -6],
    pl: [4, 5, 5, 6],
    mr: [-4, -5, 0, 0],
    pr: [4, 5, 0, 0],
    animationDuration: 300 + 'ms',
    animationDelay: 0 + 'ms',
    animationName: fade.toString(),
    animationFillMode: 'backwards',
  },
  expandedHeading: {
    color: 'secondary',
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    fontSize: 1,
    mt: [5, 3, 3, 3],
    mb: 2,
  },
}

const ProjectRow = ({ project }) => {
  const {
    project_id,
    category,
    name,
    country,
    issued,
    retired,
    registered_at,
    details_url,
    registry,
    protocol,
    description,
  } = project
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <TableRow
        values={[
          {
            label: (
              <Box
                onClick={() => setExpanded((prev) => !prev)}
                sx={{
                  transition: 'color 0.15s',
                  cursor: 'pointer',
                  position: 'relative',
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover #expander': {
                      stroke: COLORS[category],
                    },
                  },
                }}
              >
                <Expander
                  id='expander'
                  value={expanded}
                  sx={{
                    position: 'absolute',
                    left: -4,
                    width: '18px',
                    height: '18px',
                  }}
                />
                <Badge
                  sx={{
                    color: COLORS[category],
                    '& :first-of-type': {
                      fontFamily: 'body',
                    },
                  }}
                >
                  {project_id}
                </Badge>
              </Box>
            ),
            key: 'project_id',
            width: [2, 1, 1, 1],
          },
          { key: 'name', label: name ?? '?', width: [4, 3, 3, 3] },
          {
            key: 'issued',
            label: (
              <Badge>{issued > 100 ? format('.3s')(issued) : issued}</Badge>
            ),
            width: [0, 1, 1, 1],
          },
          {
            key: 'retired',
            label: (
              <Badge>{retired > 100 ? format('.3s')(retired) : retired}</Badge>
            ),
            width: [0, 1, 1, 1],
          },
          {
            key: 'registered_at',
            label: registered_at
              ? formatDate(registered_at, { year: 'numeric' })
              : '?',
            width: [0, 1, 1, 1],
          },
        ]}
      />
      {expanded && (
        <TableRow
          sx={sx.expanded}
          values={[
            {
              key: 'description',
              width: [6, 8, 8, 8],
              start: 1,
              label: (
                <Row
                  columns={[6, 8, 8, 8]}
                  sx={{
                    color: 'primary',
                    height: 'fit-content',
                  }}
                >
                  <Column
                    start={1}
                    width={[6, 7, 7, 7]}
                    sx={{ position: 'relative' }}
                  >
                    <IconButton
                      aria-label='Collapse'
                      onClick={() => setExpanded(false)}
                      sx={{
                        position: 'absolute',
                        display: ['none', 'inherit', 'inherit', 'inherit'],
                        p: 0,
                        right: (theme) =>
                          [4, 5, 5, 6].map(
                            (i) => `calc(-${theme.space[i]}px - 32px)`
                          ),
                        cursor: 'pointer',
                      }}
                    >
                      <XCircle
                        sx={{
                          transition: '0.15s',
                          stroke: COLORS[category],
                          '&:hover': {
                            stroke: 'primary',
                          },
                        }}
                      />
                    </IconButton>
                  </Column>
                  <Column start={[1]} width={[6, 2, 2, 2]}>
                    <Box sx={{ ...sx.expandedHeading, mt: 3 }}>Country</Box>
                    {country}
                  </Column>

                  <Column start={[1, 3, 3, 3]} width={[3, 2, 2, 2]}>
                    <Box sx={sx.expandedHeading}>Category</Box>
                    <Tag
                      sx={{
                        color: COLORS[category],
                        width: 'fit-content',
                      }}
                    >
                      {category}
                    </Tag>
                  </Column>

                  <Column start={[4, 5, 5, 5]} width={[3, 2, 2, 2]}>
                    <Box sx={sx.expandedHeading}>Protocol</Box>
                    {protocol}
                  </Column>

                  <Column
                    start={1}
                    width={[6, 6, 6, 6]}
                    sx={{ mt: [0, 3, 3, 3] }}
                  >
                    <Box sx={sx.expandedHeading}>Description</Box>
                    <Box sx={{ fontSize: 0 }}>{description}</Box>
                  </Column>

                  <Column
                    start={[1, 7, 7, 7]}
                    width={[6, 1, 1, 1]}
                    sx={{ mt: [0, 3, 3, 3] }}
                  >
                    <Box sx={sx.expandedHeading}>Details</Box>
                    <Button
                      href={details_url}
                      suffix={
                        <RotatingArrow
                          sx={{ mt: '-3px', width: 13, height: 13 }}
                        />
                      }
                      inverted
                      sx={{ fontSize: 1 }}
                    >
                      {LABELS.registry[registry]}
                    </Button>
                  </Column>
                </Row>
              ),
            },
          ]}
        />
      )}
    </>
  )
}

export default ProjectRow
