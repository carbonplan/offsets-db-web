import {
  Badge,
  Button,
  Column,
  Expander,
  Row,
  Tag,
} from '@carbonplan/components'
import { RotatingArrow, XCircle } from '@carbonplan/icons'
import { keyframes } from '@emotion/react'
import { alpha } from '@theme-ui/color'
import { format } from 'd3-format'
import { useState } from 'react'
import { Box, Flex, IconButton } from 'theme-ui'

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
    listed_at,
    project_url,
    registry,
    protocol,
    description,
  } = project
  const [expanded, setExpanded] = useState(false)
  const color = COLORS[category[0]] ?? COLORS.other

  return (
    <>
      <TableRow
        values={[
          {
            label: (
              <Box
                sx={{
                  transition: 'color 0.15s',
                  cursor: 'pointer',
                  position: 'relative',
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover #expander': {
                      stroke: color,
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
                    color: color,
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
            key: 'details',
            label: (
              <Button
                suffix={
                  <RotatingArrow sx={{ mt: '-3px', width: 13, height: 13 }} />
                }
                href={`/projects/${project_id}`}
                onClick={(e) => e.stopPropagation()}
                inverted
                sx={{ fontSize: 1, mt: '5px' }}
              >
                Details
              </Button>
            ),
            width: [0, 1, 1, 1],
          },
        ]}
        sx={{
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover #expander': {
              stroke: color,
            },
          },
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((prev) => !prev)}
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
                          stroke: color,
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
                    {category.map((c) => (
                      <Tag
                        key={c}
                        sx={{
                          color: COLORS[c] ?? COLORS.other,
                          width: 'fit-content',
                        }}
                      >
                        {c.replace(/-/g, ' ')}
                      </Tag>
                    ))}
                  </Column>

                  <Column start={[4, 5, 5, 5]} width={[3, 2, 2, 2]}>
                    <Box sx={sx.expandedHeading}>Protocol</Box>
                    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                      {protocol.map((d) => (
                        <Box key={d}>{d}</Box>
                      ))}
                    </Flex>
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
                    <Button
                      href={project_url}
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
