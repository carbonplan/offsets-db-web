import { Badge, Column, Row } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Divider, Flex } from 'theme-ui'

import { COLORS } from './constants'
import { formatValue } from './utils'
import CreditCharts from './charts/credit-charts'
import Credits from './credits'
import Layout from './layout'
import ProjectOverview from './project-overview'
import Sidebar from './sidebar'
import Timeline from './timeline'
import BackButton from './back-button'

const Project = ({ project }) => {
  const [transactionType, setTransactionType] = useState(null)
  const { project_id, name, category, issued, retired } = project
  const color = COLORS[category[0]] ?? COLORS.other

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
    creditsLabel: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
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
          <BackButton sx={{ mt: 3, mb: [0, 0, 3, 3] }} />
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
            userSelect: 'all',
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
            <ProjectOverview project={project} />
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
          <Badge sx={sx.creditsAmount}>{formatValue(issued)}</Badge>
        </Column>
        <Column start={[1, 3, 3, 3]} width={[6, 2, 2, 2]}>
          <Box sx={sx.creditsLabel}>Credits retired</Box>
          <Badge sx={sx.creditsAmount}>{formatValue(retired)}</Badge>
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
