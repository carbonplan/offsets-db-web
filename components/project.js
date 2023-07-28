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
import { Box, Flex, IconButton } from 'theme-ui'
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
    borderColor: 'secondary',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: '1px',
    fontFamily: 'heading',
    letterSpacing: 'heading',
    fontSize: 2,
    pb: 2,
    mb: 3,
  },
}

const Project = ({ project }) => {
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
                      stroke: COLORS.category[category],
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
                    color: COLORS.category[category],
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
              key: 'protocol',
              width: [6, 3, 3, 3],
              label: (
                <Row
                  columns={[6, 3, 3, 3]}
                  sx={{
                    color: 'primary',
                    height: 'fit-content',
                  }}
                >
                  <Column
                    start={1}
                    width={[6, 3, 3, 3]}
                    sx={sx.expandedHeading}
                  >
                    Protocol
                  </Column>
                  <Column start={1} width={[3, 3, 3, 3]}>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 3,
                      }}
                    >
                      <Tag
                        sx={{
                          color: COLORS.category[category],
                          width: 'fit-content',
                        }}
                      >
                        {category}
                      </Tag>
                      {protocol}
                    </Flex>
                  </Column>

                  <Column
                    start={1}
                    width={[6, 3, 3, 3]}
                    sx={{ ...sx.expandedHeading, mt: [0, 4, 4, 4] }}
                  >
                    Details
                  </Column>
                  <Column start={1} width={[3, 3, 3, 3]}>
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
            {
              key: 'description',
              width: [6, 5, 5, 5],
              start: [1, 4, 4, 4],
              label: (
                <Row
                  columns={[6, 5, 5, 5]}
                  sx={{
                    color: 'primary',
                    height: 'fit-content',
                  }}
                >
                  <Column
                    start={1}
                    width={[6, 4, 4, 4]}
                    sx={{ ...sx.expandedHeading, position: 'relative' }}
                  >
                    Description
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
                        top: -1,
                        cursor: 'pointer',
                      }}
                    >
                      <XCircle
                        sx={{
                          transition: '0.15s',
                          stroke: COLORS.category[category],
                          '&:hover': {
                            stroke: 'primary',
                          },
                        }}
                      />
                    </IconButton>
                  </Column>
                  <Column start={1} width={[6, 4, 4, 4]}>
                    {description}
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

export default Project
