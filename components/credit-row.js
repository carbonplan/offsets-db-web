import { useState } from 'react'
import {
  formatDate,
  Button,
  Row,
  Column,
  Expander,
} from '@carbonplan/components'
import { Box, Flex, Text } from 'theme-ui'
import { keyframes } from '@emotion/react'
import { alpha } from '@theme-ui/color'
import { RotatingArrow } from '@carbonplan/icons'

import Quantity from './quantity'
import { TableRow } from './table'
import ProjectBadge from './project-badge'
import { COLORS } from './constants'
import BeneficiaryOverview from './beneficiary-overview'
import { getProjectCategory } from './utils'

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const CreditRow = ({ color, event, projectView, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  const {
    projects,
    transaction_date,
    transaction_type,
    quantity,
    vintage,
    retirement_beneficiary_harmonized,
    retirement_account,
    retirement_beneficiary,
    retirement_note,
    retirement_reason,
  } = event

  const columns = projectView ? [6, 6, 7, 7] : [6, 8, 8, 8]
  const eventColor =
    color ?? COLORS[getProjectCategory(projects[0])] ?? COLORS.other
  const sx = {
    expanded: {
      background: alpha(eventColor, 0.2),
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
    element: {
      transition: 'color 0.15s',
      color: expanded ? 'primary' : 'secondary',
    },
  }

  const beneficiaryInfo =
    retirement_beneficiary_harmonized ??
    retirement_beneficiary ??
    retirement_account ??
    retirement_note ??
    retirement_reason

  return (
    <>
      <TableRow
        columns={columns}
        values={[
          ...(projectView
            ? []
            : [
                {
                  label: <ProjectBadge project={projects[0]} link />,
                  key: 'project_id',
                  width: [2, 1, 1, 1],
                },
              ]),

          {
            key: 'transaction_date',
            label: transaction_date ? (
              <Text
                sx={{
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  ...sx.element,
                }}
              >
                {formatDate(transaction_date, {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  separator: '-',
                })}
              </Text>
            ) : (
              '?'
            ),
            width: [2, 1, 1, 1],
          },
          {
            key: 'transaction_type',
            label: (
              <Text
                sx={{
                  textTransform: 'capitalize',
                  ...sx.element,
                }}
              >
                {transaction_type}
              </Text>
            ),
            width: [0, 1, 1, 1],
          },
          {
            key: 'quantity',
            label: (
              <Flex sx={{ gap: 2, ...sx.element }}>
                <Quantity
                  color={expanded ? eventColor : color}
                  value={quantity}
                />
                <Box sx={{ display: ['inherit', 'none', 'none', 'none'] }}>
                  {transaction_type === 'retirement' ? 'retired' : 'issued'}
                </Box>
              </Flex>
            ),
            width: [2, 1, 1, 1],
          },
          {
            key: 'vintage',
            label: <Box sx={{ ...sx.element }}>{vintage ?? '?'}</Box>,
            width: [projectView ? 1 : 0, 1, 1, 1],
          },
          {
            key: 'beneficiary',
            label: (
              <Text>
                {beneficiaryInfo ? (
                  <Box
                    onClick={() => setExpanded((prev) => !prev)}
                    sx={{
                      ...sx.element,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'color 0.25s',
                      '@media (hover: hover) and (pointer: fine)': {
                        '&:hover': {
                          color: 'primary',
                        },
                        '&:hover #expander': {
                          stroke: eventColor,
                        },
                      },
                    }}
                  >
                    <Row columns={projectView ? [0, 2, 2, 2] : [0, 3, 3, 3]}>
                      <Column
                        start={1}
                        width={projectView ? [0, 2, 2, 2] : [0, 2, 2, 2]}
                      >
                        <Box
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mr: [0, 2, 4, 4],
                          }}
                        >
                          {beneficiaryInfo}
                        </Box>
                      </Column>
                    </Row>
                    <Expander
                      id='expander'
                      value={expanded}
                      sx={{
                        position: 'absolute',
                        top: '-2px',
                        right: projectView
                          ? [0, 0, '-14px', '-14px']
                          : [0, 0, 5, 6],
                        width: 18,
                        stroke: expanded ? alpha(eventColor, 0.8) : 'secondary',
                      }}
                    />
                  </Box>
                ) : (
                  <Text sx={{ opacity: 0.5 }}>
                    {transaction_type === 'issuance' ? 'N/A' : 'None listed'}
                  </Text>
                )}
              </Text>
            ),
            width: projectView ? [0, 2, 2, 2] : [0, 3, 3, 3],
          },
        ]}
        sx={{
          ml: [-4, -5, -5, -6],
          pl: [4, 5, 5, 6],
          mr: [-4, -5, 0, 0],
          pr: [4, 5, 0, 0],
          backgroundColor: expanded ? alpha(eventColor, 0.2) : 'none',
          transition: 'background-color 0.3s ease',
        }}
        {...props}
      />

      {expanded && (
        <TableRow
          sx={sx.expanded}
          columns={columns}
          values={[
            {
              key: 'description',
              width: columns,
              start: 1,
              label: (
                <>
                  <Row
                    columns={columns}
                    sx={{
                      color: 'primary',
                      height: 'fit-content',
                    }}
                  >
                    <BeneficiaryOverview
                      event={event}
                      color={eventColor}
                      columns={projectView ? 4 : 6}
                    />
                    {!projectView && (
                      <Column start={[1, 3, 3, 3]} width={3}>
                        <Button
                          href={`/projects/${projects[0].project_id}`}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: eventColor,
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
                          View project
                        </Button>
                      </Column>
                    )}
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

export default CreditRow
