import { Column, Row } from '@carbonplan/components'
import { Chart, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import { useQueries } from '../queries'
import Brush from './brush'

const EventCharts = ({ transactionType, setTransactionType }) => {
  const { transactionBounds, setTransactionBounds } = useQueries()

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
          Credits issued / year
          <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
            {transactionBounds
              ? transactionBounds.join(' - ')
              : 'Drag to filter'}
          </Box>
        </Flex>
        <Box sx={{ height: '200px', mt: 3 }}>
          <Chart x={[2000, 2023]} y={[0, 6]} padding={{ left: 0 }}>
            <Ticks bottom />
            <TickLabels bottom />
            <Grid vertical />
            <Plot>
              <Brush
                clear={transactionType === 'retirement'}
                setBounds={(value) => {
                  setTransactionBounds(value)
                  setTransactionType(value ? 'issuance' : null)
                }}
              />
            </Plot>
          </Chart>
        </Box>
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
        <Flex sx={{ gap: 3 }}>
          Credits retired / year
          <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
            {transactionBounds
              ? transactionBounds.join(' - ')
              : 'Drag to filter'}
          </Box>
        </Flex>
        <Box sx={{ height: '200px', mt: 3 }}>
          <Chart x={[2000, 2023]} y={[0, 6]} padding={{ left: 0 }}>
            <Ticks bottom />
            <TickLabels bottom />
            <Grid vertical />
            <Plot>
              <Brush
                clear={transactionType === 'issuance'}
                setBounds={(value) => {
                  setTransactionBounds(value)
                  setTransactionType(value ? 'retirement' : null)
                }}
              />
            </Plot>
          </Chart>
        </Box>
      </Column>
    </Row>
  )
}

export default EventCharts
