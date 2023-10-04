import { Chart, Bar, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import { useCallback, useMemo } from 'react'
import { format } from 'd3-format'

import Brush from './brush'
import { useQueries } from '../queries'
import useFetcher from '../use-fetcher'

const CreditTransactions = ({
  project_id,
  transactionType,
  setTransactionType,
}) => {
  const { transactionBounds, setTransactionBounds } = useQueries()
  const url = `charts/credits_by_transaction_date${
    project_id ? '/' + project_id : ''
  }`
  const { data, error, isLoading } = useFetcher(url, {
    transactionType,
    filters: false,
  })
  const {
    data: filteredData,
    error: filteredError,
    isLoading: filteredLoading,
  } = useFetcher(url, { transactionType })

  const handleBoundsChange = useCallback(
    (bounds) => {
      setTransactionBounds(bounds)
      setTransactionType(bounds ? transactionType : null)
    },
    [transactionType, setTransactionBounds]
  )

  const { lines, range } = useMemo(() => {
    if (!data) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = data
        .reduce((accum, { start, end, value }) => {
          if (start != null && end != null) {
            const year = new Date(`${start}T00:00:00`).getFullYear()

            const existingEntry = accum.find((d) => d[0] === year)
            if (existingEntry) {
              existingEntry[1] += value
            } else {
              accum.push([year, value])
            }
            return accum
          } else {
            return accum
          }
        }, [])
        .sort((a, b) => b[0] - a[0])

      const range = lines.reduce(
        ([min, max], d) => [Math.min(min, d[1]), Math.max(max, d[1])],
        [Infinity, -Infinity]
      )
      return { lines, range }
    }
  }, [data])

  const { lines: filteredLines } = useMemo(() => {
    if (!filteredData) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = filteredData
        .reduce((accum, { start, end, value }) => {
          if (start != null && end != null) {
            const year = new Date(`${start}T00:00:00`).getFullYear()

            const existingEntry = accum.find((d) => d[0] === year)
            if (existingEntry) {
              existingEntry[1] += value
            } else {
              accum.push([year, value])
            }
            return accum
          } else {
            return accum
          }
        }, [])
        .sort((a, b) => b[0] - a[0])

      return { lines }
    }
  }, [filteredData])

  return (
    <>
      <Flex sx={{ gap: 3 }}>
        Credits {transactionType === 'issuance' ? 'issued' : 'retired'} / year
        <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
          {transactionBounds ? transactionBounds.join(' - ') : 'Drag to filter'}
        </Box>
      </Flex>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart x={[2000, 2023]} y={range} padding={{ left: 32 }}>
          <Ticks bottom />
          <TickLabels bottom />
          <TickLabels left count={3} format={format('~s')} />
          <Grid vertical />
          <Plot>
            <Brush setBounds={handleBoundsChange} />
            <Bar data={lines} color='secondary' />
            <Bar data={filteredLines} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default CreditTransactions
