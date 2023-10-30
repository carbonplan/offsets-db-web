import { Chart, Grid, Plot, Ticks, TickLabels, Bar } from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import { useEffect, useMemo, useState } from 'react'
import { format } from 'd3-format'

import Brush from './brush'
import { useQueries } from '../queries'
import useFetcher from '../use-fetcher'

const ProjectCredits = ({ creditType = 'issued' }) => {
  const [bins, setBins] = useState(null)
  const { issuedBounds, setIssuedBounds } = useQueries()
  const { data, error, isLoading } = useFetcher(
    'charts/projects_by_credit_totals',
    {
      filters: false,
      creditType,
    }
  )
  const {
    data: filteredData,
    error: filteredError,
    isLoading: filteredLoading,
  } = useFetcher('charts/projects_by_credit_totals', {
    creditType,
    binWidth: bins,
  })

  const { lines, range, domain, binWidth } = useMemo(() => {
    if (!data) {
      return { lines: [], range: [0, 0], domain: [0, 0], binWidth: null }
    } else {
      let binWidth = 0
      const lines = data.data
        .reduce((accum, { start, end, category, value }) => {
          if (start != null && end != null) {
            binWidth = end - start
            const existingEntry = accum.find((d) => d[0] === start)
            if (existingEntry) {
              existingEntry[1] += value
            } else {
              accum.push([start, value])
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
      const domain = lines.reduce(
        ([min, max], d) => [Math.min(min, d[0]), Math.max(max, d[0])],
        [Infinity, -Infinity]
      )

      return { lines, range, domain, binWidth }
    }
  }, [data])

  useEffect(() => {
    setBins(binWidth)
  }, [binWidth])

  const { lines: filteredLines } = useMemo(() => {
    if (!filteredData) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = filteredData.data
        .reduce((accum, { start, end, category, value }) => {
          if (start != null && end != null) {
            const existingEntry = accum.find((d) => d[0] === start)
            if (existingEntry) {
              existingEntry[1] += value
            } else {
              accum.push([start, value])
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
        Credits issued
        <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
          {issuedBounds ? issuedBounds.join(' - ') : 'Drag to filter'}
        </Box>
      </Flex>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart x={domain} y={range} padding={{ left: 32 }}>
          <Ticks bottom />
          <TickLabels bottom format={format('.1s')} />
          <TickLabels left count={3} format={format('~s')} />
          <Grid vertical />
          <Plot>
            <Brush setBounds={setIssuedBounds} />
            <Bar data={lines} color='secondary' />
            <Bar data={filteredLines} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default ProjectCredits
