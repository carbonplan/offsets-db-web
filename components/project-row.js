import {
  Badge,
  Button,
  Expander,
  formatDate,
  Row,
} from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { keyframes } from '@emotion/react'
import { alpha } from '@theme-ui/color'
import { useState } from 'react'
import { Box } from 'theme-ui'

import { COLORS } from './constants'
import { TableRow } from './table'
import { formatValue } from './utils'
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
      ml: [-4, -5, -5, -6],
      pl: [4, 5, 5, 6],
      mr: [-4, -5, 0, 0],
      pr: [4, 5, 0, 0],
      mb: 1,
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
                    left: ['-17px', -4, -4, -4],
                    top: '2px', // centering, not ideal.
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
          {
            key: 'name',
            label: <Box sx={{ mt: 1 }}>{name ?? '?'}</Box>,
            width: [4, 3, 3, 3],
          },
          {
            key: 'issued',
            label: (
              <Badge
                sx={{
                  color: expanded ? color : null,
                }}
              >
                {formatValue(issued)}
              </Badge>
            ),
            width: [0, 1, 1, 1],
          },
          {
            key: 'retired',
            label: (
              <Badge
                sx={{
                  color: expanded ? color : null,
                }}
              >
                {formatValue(retired)}
              </Badge>
            ),
            width: [0, 1, 1, 1],
          },
          {
            key: 'listed_at',
            label: (
              <Badge
                sx={{ whiteSpace: 'nowrap', color: expanded ? color : null }}
              >
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
            width: [0, 1, 1, 1],
          },

          {
            key: 'details',
            label: (
              <Badge
                sx={{
                  color: expanded ? color : null,
                }}
              >
                <Button
                  href={`/projects/${project_id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <RotatingArrow
                    sx={{
                      mb: '1px',
                      width: 14,
                      height: 14,
                      color: expanded ? color : null,
                    }}
                  />
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
          ml: [-4, -5, -5, -6],
          pl: [4, 5, 5, 6],
          mr: [-4, -5, 0, 0],
          pr: [4, 5, 0, 0],
          '&:hover': {
            backgroundColor: alpha(color, expanded ? 0.2 : 0.1),
            transition: 'background-color 0.3s ease',
          },
          backgroundColor: expanded ? alpha(color, 0.2) : 'none',
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
                <>
                  <Row
                    columns={[6, 8, 8, 8]}
                    sx={{
                      color: 'primary',
                      height: 'fit-content',
                    }}
                  >
                    <ProjectOverview project={project} columns={6} />
                  </Row>
                  <Row columns={1}>
                    <Button
                      href={`/projects/${project_id}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: 1,
                      }}
                      inverted
                      suffix={
                        <RotatingArrow
                          sx={{
                            width: 14,
                            height: 14,
                            mt: -1,
                          }}
                        />
                      }
                    >
                      View full details
                    </Button>
                  </Row>
                </>
              ),
            },
          ]}
        />
      )}
    </>
  )
}

export default ProjectRow
