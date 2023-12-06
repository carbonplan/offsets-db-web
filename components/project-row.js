import { Badge, Button, Column, Expander, Row } from '@carbonplan/components'
import { RotatingArrow, XCircle } from '@carbonplan/icons'
import { keyframes } from '@emotion/react'
import { alpha } from '@theme-ui/color'
import { useState } from 'react'
import { Box, IconButton } from 'theme-ui'

import { COLORS } from './constants'
import { TableRow } from './table'
import { formatDate, formatValue } from './utils'
import ProjectOverview from './project-overview'

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const ProjectRow = ({ project }) => {
  const { project_id, category, name, issued, retired, listed_at } = project
  const [expanded, setExpanded] = useState(false)
  const color = COLORS[category[0]] ?? COLORS.other

  const sx = {
    expanded: {
      background: alpha(color, 0.2),
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
  }

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
                    userSelect: 'all',
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
            label: <Badge>{formatValue(issued)}</Badge>,
            width: [0, 1, 1, 1],
          },
          {
            key: 'retired',
            label: <Badge>{formatValue(retired)}</Badge>,
            width: [0, 1, 1, 1],
          },
          {
            key: 'listed_at',
            label: (
              <Badge sx={{ whiteSpace: 'nowrap' }}>
                {listed_at
                  ? formatDate(listed_at, {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      separator: '-',
                    })
                  : '?'}
              </Badge>
            ),
            width: [2, 1, 1, 1],
          },

          {
            key: 'details',
            label: (
              <Badge>
                <Button
                  href={`/projects/${project_id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <RotatingArrow sx={{ mt: 1, width: 13, height: 13 }} />
                </Button>
              </Badge>
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

                  <ProjectOverview project={project} minWidth={2} />
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
