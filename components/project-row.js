import { Badge, Button, Expander, Row } from '@carbonplan/components'
import { RotatingArrow, Arrow } from '@carbonplan/icons'
import { keyframes } from '@emotion/react'
import { alpha } from '@theme-ui/color'
import { useState } from 'react'
import { Box } from 'theme-ui'

import { COLORS } from './constants'
import { TableRow } from './table'
import ProjectOverview from './project-overview'
import Quantity from './quantity'
import { getProjectCategory } from './utils'

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const ProjectRow = ({ project }) => {
  const { project_id, name, issued, retired } = project
  const [expanded, setExpanded] = useState(false)
  const [hoveredDetails, setHoveredDetails] = useState(false)
  const color = COLORS[getProjectCategory(project)] ?? COLORS.other

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
                    ml: ['-17px', '-25px', '-25px', '-25px'],
                    top: '2px', // centering, not ideal.
                    width: 18,
                    stroke: expanded ? alpha(color, 0.8) : 'secondary',
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
            label: (
              <Box sx={{ mt: 1, color: expanded ? 'primary' : 'secondary' }}>
                {name ?? '?'}
              </Box>
            ),
            width: [4, 3, 3, 3],
          },
          {
            key: 'issued',
            label: <Quantity color={expanded ? color : null} value={issued} />,
            width: [0, 1, 1, 1],
          },
          {
            key: 'retired',
            label: <Quantity color={expanded ? color : null} value={retired} />,
            width: [0, 1, 1, 1],
          },
          {
            key: 'details',
            label: (
              <Badge
                onMouseOver={() => setHoveredDetails(true)} // css hover selectors not working
                onMouseOut={() => setHoveredDetails(false)} // for this context
                sx={{
                  color: expanded || hoveredDetails ? color : null,
                  '&:hover #arrow': {
                    transform: 'rotate(45deg)',
                  },
                }}
              >
                <Button
                  href={`/projects/${project_id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Arrow
                    id='arrow'
                    sx={{
                      mt: [1, 1, 1, 0],
                      mb: [0, 0, 0, '1px'],
                      width: 14,
                      height: 14,
                      color: expanded || hoveredDetails ? color : null,
                      transition: 'transform 0.15s',
                    }}
                  />
                </Button>
              </Badge>
            ),
            start: [1, 8, 8, 8],
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
                        color,
                        fontFamily: 'mono',
                        letterSpacing: 'mono',
                        textTransform: 'uppercase',
                        fontSize: 1,
                      }}
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
