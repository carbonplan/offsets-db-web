import { Column, Row } from '@carbonplan/components'
import {
  Chart,
  Grid,
  Plot,
  Ticks,
  TickLabels,
  useChart,
} from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import { select } from 'd3-selection'
import { brushX } from 'd3-brush'
import { useEffect, useRef } from 'react'
import { useQueries } from './queries'

const Brush = ({ setBounds }) => {
  const brush = useRef(null)
  const { x } = useChart()

  useEffect(() => {
    if (brush.current) {
      select(brush.current).call(
        brushX()
          .extent([
            [0, 0],
            [100, 100],
          ])
          .on('start brush', (e) => {
            if (e.selection[0] == e.selection[1]) {
              setBounds(null)
            } else {
              setBounds(
                [x.invert(e.selection[0]), x.invert(e.selection[1])].map(
                  Math.round
                )
              )
            }
          })
      )
    }
  }, [])

  return (
    <Box
      as='g'
      ref={brush}
      sx={{ '.selection': { stroke: 'none', fill: 'secondary' } }}
    />
  )
}
const ProjectCharts = () => {
  const { registrationBounds, setRegistrationBounds } = useQueries()

  return (
    <Row
      columns={[6, 8, 8, 8]}
      sx={{
        color: 'primary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        textTransform: 'uppercase',
      }}
    >
      <Column start={1} width={[6, 4, 4, 4]}>
        <Flex sx={{ gap: 3 }}>
          Project registration
          <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
            {registrationBounds
              ? registrationBounds.join(' - ')
              : 'Drag to filter'}
          </Box>
        </Flex>
        <Box sx={{ height: '200px', mt: 3 }}>
          <Chart x={[2000, 2023]} y={[0, 6]} padding={{ left: 0 }}>
            <Ticks bottom />
            <TickLabels bottom />
            <Grid vertical />
            <Plot>
              <Brush setBounds={setRegistrationBounds} />
            </Plot>
          </Chart>
        </Box>
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
        <Box sx={{ height: '200px' }}>TK</Box>
      </Column>
    </Row>
  )
}

export default ProjectCharts
