import { Badge, Button, Column, Link, Row, Tag } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { format } from 'd3-format'
import { useState } from 'react'
import { Box, Divider, Flex } from 'theme-ui'

import CreditCharts from './charts/credit-charts'
import { COLORS, LABELS } from './constants'
import Credits from './credits'
import Layout from './layout'
import Sidebar from './sidebar'
import Timeline from './timeline'

const Empty = () => {
  return <Box sx={{ color: 'secondary' }}>N/A</Box>
}

const formatter = (value) => {
  return value > 10000 ? format('.3s')(value) : value
}

const Project = ({ project }) => {
  const [transactionType, setTransactionType] = useState(null)
  const {
    project_id,
    name,
    category,
    country,
    status,
    developer,
    protocol,
    is_compliance,
    proponent,
    details_url,
    registry,
    description,
    issued,
    retired,
  } = project
  const color = COLORS[category[0]]

  const sx = {
    sectionLabel: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
      color,
      fontSize: 4,
      mt: 5,
      mb: 2,
    },
    fieldLabel: {
      color,
      mt: 5,
      mb: 2,
    },
    fieldValue: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      fontSize: 1,
    },
    creditsLabel: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
      color: 'secondary',
      mt: [4, 2, 2, 2],
    },
    creditsAmount: {
      mt: 3,
      fontSize: 4,
      height: ['34px'],
    },
    badge: {
      transition: 'color 0.15s',
      '& div': {
        color: 'secondary',
      },
      '&:hover div': {
        color: 'primary',
      },
    },
  }

  return (
    <Layout
      sidebar={
        <Sidebar>
          <Flex
            sx={{
              gap: 3,
              fontFamily: 'mono',
              letterSpacing: 'mono',
              textTransform: 'uppercase',
              mt: 3,
              mb: [0, 0, 3, 3],
            }}
          >
            <Box sx={{ color: 'secondary' }}>Back to</Box>
            <Link sx={sx.badge} href='/projects'>
              <Badge>Projects</Badge>
            </Link>
            <Link sx={sx.badge} href='/credits'>
              <Badge>Credits</Badge>
            </Link>
          </Flex>

          <Divider
            sx={{
              mr: [-4, -5, -5, -6],
              ml: [-4, -5, 0, 0],
              display: ['none', 'none', 'inherit', 'inherit'],
            }}
          />
        </Sidebar>
      }
    >
      <Flex sx={{ gap: 3, my: 3, alignItems: 'flex-end' }}>
        <Badge
          sx={{
            color,
            fontSize: 5,
            height: ['46px'],
            flexShrink: 0,
            px: 2,
            '& :first-of-type': {
              fontFamily: 'body',
            },
          }}
        >
          {project_id}
        </Badge>
        <Box sx={{ fontFamily: 'mono', letterSpacing: 'mono', mb: 1 }}>
          {name}
        </Box>
      </Flex>
      <Divider
        sx={{
          ml: [-4, -5, -5, -6],
          mr: [-4, -5, 0, 0],
          my: 3,
        }}
      />
      <Row columns={[6, 8, 8, 8]}>
        <Column start={[1]} width={[6, 6, 4, 4]}>
          <Box sx={sx.sectionLabel}>Overview</Box>

          <Row columns={[6, 6, 4, 4]}>
            <Column start={[1]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Country</Box>
              <Box sx={sx.fieldValue}>{country}</Box>
            </Column>
            <Column start={[4, 3, 2, 2]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Status</Box>
              <Box sx={sx.fieldValue}>{status}</Box>
            </Column>
            <Column start={[1, 5, 3, 3]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Developer</Box>
              <Box sx={sx.fieldValue}>{developer ?? <Empty />}</Box>
            </Column>

            <Column start={[4, 1, 1, 1]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Category</Box>
              <Box sx={sx.fieldValue}>
                {category.map((c) => (
                  <Tag
                    key={c}
                    sx={{
                      color: COLORS[c],
                      width: 'fit-content',
                    }}
                  >
                    {c}
                  </Tag>
                ))}
              </Box>
            </Column>
            <Column start={[1, 3, 2, 2]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Protocol</Box>
              <Box sx={{ ...sx.fieldValue, textTransform: 'uppercase' }}>
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
            <Column start={[4, 5, 3, 3]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>ARB</Box>
              <Box sx={sx.fieldValue}>{is_compliance ? 'Yes' : 'No'}</Box>
            </Column>

            <Column start={[1]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Proponent</Box>
              <Box sx={sx.fieldValue}>{proponent ?? <Empty />}</Box>
            </Column>
            <Column start={[4, 3, 2, 2]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Registry</Box>
              <Box sx={sx.fieldValue}>
                <Button
                  href={details_url}
                  suffix={<RotatingArrow />}
                  sx={sx.fieldValue}
                >
                  {LABELS.registry[registry]}
                </Button>
              </Box>
            </Column>

            <Column start={[1]} width={[6, 6, 4, 4]}>
              <Box sx={sx.fieldLabel}>Registry description</Box>
              <Box sx={{ ...sx.fieldValue, wordWrap: 'break-word' }}>
                {description}
              </Box>
            </Column>
          </Row>
        </Column>

        <Column start={[1, 1, 5, 5]} width={[6, 8, 3, 3]}>
          <Box sx={sx.sectionLabel}>Timeline</Box>

          <Timeline project={project} />
        </Column>
      </Row>

      <Row columns={[6, 8, 8, 8]} sx={{ mt: 6 }}>
        <Column start={[1]} width={[6, 6, 4, 4]}>
          <Box sx={sx.sectionLabel}>Credits</Box>
        </Column>
        <Column start={[1]} width={[6, 2, 2, 2]}>
          <Box sx={sx.creditsLabel}>Credits issued</Box>
          <Badge sx={sx.creditsAmount}>{formatter(issued)}</Badge>
        </Column>
        <Column start={[1, 3, 3, 3]} width={[6, 2, 2, 2]}>
          <Box sx={sx.creditsLabel}>Credits retired</Box>
          <Badge sx={sx.creditsAmount}>{formatter(retired)}</Badge>
        </Column>

        <Column start={[1]} width={[6, 8, 8, 8]} sx={{ mt: 5 }}>
          <CreditCharts
            project_id={project_id}
            setTransactionType={setTransactionType}
          />
        </Column>
      </Row>

      <Row columns={[6, 8, 8, 8]} sx={{ mt: 6 }}>
        <Column start={[1]} width={[6, 6, 4, 4]}>
          <Box sx={sx.sectionLabel}>Transactions</Box>
        </Column>
      </Row>

      <Credits
        project_id={project_id}
        transactionType={transactionType}
        charts={false}
        borderTop={false}
      />
    </Layout>
  )
}

export default Project
