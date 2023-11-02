import {
  Badge,
  Button,
  Column,
  formatDate,
  Link,
  Row,
  Tag,
} from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { format } from 'd3-format'
import { useState } from 'react'
import { Box, Divider, Flex } from 'theme-ui'

import Credits from '../components/credits'
import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import Timeline from '../components/timeline'
import useFetcher from '../components/use-fetcher'

const sx = {
  sectionLabel: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    color: 'primary',
    fontSize: 4,
    mt: 5,
    mb: 2,
  },
  fieldLabel: {
    color: 'primary',
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

const Project = () => {
  const { data } = useFetcher('clips/', {
    filters: false,
  })

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
      <Divider
        sx={{
          ml: [-4, -5, -5, -6],
          mr: [-4, -5, 0, 0],
          my: 3,
        }}
      />
      <Row columns={[6, 8, 8, 8]}>
        <Column start={[1]} width={[6, 8, 6, 6]}>
          <Box sx={sx.sectionLabel}>Articles</Box>
          {data && <Timeline project={{ clips: data.data }} />}
        </Column>
      </Row>

      <Row columns={[6, 8, 8, 8]} sx={{ mt: 6 }}>
        <Column start={[1]} width={[6, 6, 4, 4]}>
          <Box sx={sx.sectionLabel}>Credits</Box>
        </Column>
      </Row>

      <Row columns={[6, 8, 8, 8]} sx={{ mt: 6 }}>
        <Column start={[1]} width={[6, 6, 4, 4]}>
          <Box sx={sx.sectionLabel}>Transactions</Box>
        </Column>
      </Row>

      <Credits charts={false} borderTop={false} />
    </Layout>
  )
}

export default Project
