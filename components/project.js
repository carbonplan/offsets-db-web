import { Badge, Button, Column, Row, Tag } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { Box, Divider, Flex } from 'theme-ui'
import { COLORS, LABELS } from './constants'
import Layout from './layout'
import Sidebar from './sidebar'
import Timeline from './timeline'

const Empty = () => {
  return <Box sx={{ color: 'secondary' }}>N/A</Box>
}

const Project = ({ project }) => {
  const {
    project_id,
    name,
    category,
    country,
    status,
    developer,
    protocol,
    is_arb,
    proponent,
    details_url,
    registry,
    description,
  } = project
  const color = COLORS[category]

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
  }

  return (
    <Layout sidebar={<Sidebar />}>
      <Flex sx={{ gap: 3, my: 3 }}>
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
        <Box sx={{ fontFamily: 'mono', letterSpacing: 'mono' }}>{name}</Box>
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
                <Tag sx={{ color }}>{category}</Tag>
              </Box>
            </Column>
            <Column start={[1, 3, 2, 2]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>Protocol</Box>
              <Box sx={{ ...sx.fieldValue, textTransform: 'uppercase' }}>
                {protocol ?? <Empty />}
              </Box>
            </Column>
            <Column start={[4, 5, 3, 3]} width={[3, 2, 1, 1]}>
              <Box sx={sx.fieldLabel}>ARB</Box>
              <Box sx={sx.fieldValue}>{is_arb ? 'yes' : 'no'}</Box>
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
    </Layout>
  )
}

export default Project
