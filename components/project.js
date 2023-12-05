import { Column, Row } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'

import { COLORS } from './constants'
import { formatValue } from './utils'
import CreditCharts from './charts/credit-charts'
import Credits from './credits'
import ProjectOverview from './project-overview'
import Timeline from './timeline'
import BackButton from './back-button'

const Project = ({ project }) => {
  const { project_id, name, category, issued, retired } = project
  const color = COLORS[category[0]] ?? COLORS.other

  const sx = {
    sectionLabel: {
      textTransform: 'uppercase',
      letterSpacing: 'smallcaps',
      fontSize: 4,
      mt: 5,
      mb: 2,
    },
    creditsLabel: {
      color,
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
      mt: 5,
      mb: 2,
    },
    creditsAmount: {
      fontFamily: 'faux',
      letterSpacing: 'faux',
      fontSize: 1,
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
    <Box>
      <Row sx={{ my: [4, 6, 6, 6] }}>
        <Column start={[1]} width={[6, 1, 1, 1]}>
          <Flex sx={{ height: '100%', alignItems: 'flex-end' }}>
            <BackButton sx={{ mb: [3, '4px', '6px', '6px'] }} />
          </Flex>
        </Column>
        <Column start={[1, 2, 2, 3]} width={[6, 6, 6, 5]}>
          <Box as='h1' variant='styles.h1' sx={{ my: [0, 0, 0, 0] }}>
            Offsets DB — Project{' '}
            <Box as='span' sx={{ color }}>
              {project_id}
            </Box>
          </Box>
        </Column>
        <Column start={[1, 2, 9, 9]} width={[5, 6, 4, 4]}>
          <Box
            sx={{
              fontSize: [2, 2, 2, 3],
              mt: '42px',
            }}
          >
            Details on{' '}
            <Box as='span' sx={{ color }}>
              {name}
            </Box>
          </Box>
        </Column>
      </Row>

      <Row>
        <Column
          start={[1, 2, 2, 2]}
          width={[6, 7, 11, 11]}
          sx={{ mt: [2, 0, 4, 4] }}
        >
          <Row columns={[6, 7, 11, 11]}>
            <Column start={[1]} width={[6, 6, 4, 4]}>
              <Row columns={[6, 6, 4, 4]}>
                <Box sx={sx.sectionLabel}>Overview</Box>
                <ProjectOverview project={project} />
              </Row>
            </Column>

            <Column start={[1, 1, 5, 5]} width={[6, 6, 6, 6]}>
              <Row columns={[6, 6, 6, 6]} sx={{ mt: [3, 5, 0, 0] }}>
                <Column start={[1]} width={[6, 6, 6, 6]}>
                  <Box sx={sx.sectionLabel}>Credits</Box>
                </Column>
                <Column start={[1]} width={[6, 3, 3, 3]}>
                  <Box sx={sx.creditsLabel}>Credits issued</Box>
                  <Box sx={sx.creditsAmount}>{formatValue(issued)}</Box>
                </Column>
                <Column start={[1, 4, 4, 4]} width={[6, 3, 3, 3]}>
                  <Box sx={sx.creditsLabel}>Credits retired</Box>
                  <Box sx={sx.creditsAmount}>{formatValue(retired)}</Box>
                </Column>

                <Column start={[1]} width={[6, 6, 6, 6]} sx={{ mt: 5 }}>
                  <CreditCharts color={color} project_id={project_id} />
                </Column>
              </Row>
            </Column>

            <Column start={[1]} width={[6, 6, 6, 6]} sx={{ mt: [3, 5, 5, 5] }}>
              <Box sx={sx.sectionLabel}>Transactions</Box>

              <Credits
                color={color}
                project_id={project_id}
                borderTop={false}
              />
            </Column>

            <Column
              start={[1, 1, 8, 8]}
              width={[6, 7, 3, 3]}
              sx={{ mt: [3, 5, 5, 5], mb: 7 }}
            >
              <Box sx={sx.sectionLabel}>Timeline</Box>

              <Timeline project={project} color={color} />
            </Column>
          </Row>
        </Column>
      </Row>
    </Box>
  )
}

export default Project
