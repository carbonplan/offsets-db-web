import { Chart, Grid, Plot, Ticks, TickLabels, Bar } from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import { useMemo } from 'react'
import { format } from 'd3-format'

import Brush from './brush'
import { useQueries } from '../queries'
import useFetcher from '../use-fetcher'

const ProjectRegistration = () => {
  const { registrationBounds, setRegistrationBounds } = useQueries()
  const { data, error, isLoading } = useFetcher(
    'charts/projects_by_registration_date',
    { filters: false }
  )
  const {
    data: filteredData,
    error: filteredError,
    isLoading: filteredLoading,
  } = useFetcher('charts/projects_by_registration_date', {})

  const { lines, range } = useMemo(() => {
    if (!data) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = data
        .reduce((accum, { start, end, category, value }) => {
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
        .reduce((accum, { start, end, category, value }) => {
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
        Project registration
        <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
          {registrationBounds
            ? registrationBounds.join(' - ')
            : 'Drag to filter'}
        </Box>
      </Flex>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart x={[2000, 2023]} y={range} padding={{ left: 32 }}>
          <Ticks bottom />
          <TickLabels bottom />
          <TickLabels left count={3} format={format('~s')} />
          <Grid vertical />
          <Plot>
            <Brush setBounds={setRegistrationBounds} />
            <Bar data={lines} color='secondary' />
            <Bar data={filteredLines} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default ProjectRegistration
