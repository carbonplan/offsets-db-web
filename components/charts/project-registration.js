import { Chart, Grid, Plot, Ticks, TickLabels, Bar } from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { useMemo } from 'react'

import Brush from './brush'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'

const fetcher = ([
  url,
  registry = {},
  category = {},
  complianceOnly,
  search,
  registrationBounds,
]) => {
  const params = new URLSearchParams()
  Object.keys(registry)
    .filter((r) => registry[r])
    .forEach((r) => params.append('registry', r))

  Object.keys(category)
    .filter((c) => category[c])
    .forEach((c) => params.append('category', c))

  if (search?.trim()) {
    params.append('search', search.trim())
  }

  if (complianceOnly) {
    params.append('is_arb', complianceOnly)
  }
  if (registrationBounds) {
    params.append('registered_at_from', `${registrationBounds[0]}-01-01`)
    params.append('registered_at_to', `${registrationBounds[1]}-12-31`)
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const ProjectRegistration = () => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    registrationBounds,
    setRegistrationBounds,
  } = useQueries()
  const { theme } = useThemeUI()
  const { data, error, isLoading } = useSWR(
    [`${process.env.NEXT_PUBLIC_API_URL}/charts/projects_by_registration_date`],
    fetcher,
    { revalidateOnFocus: false }
  )
  const {
    data: filteredData,
    error: filteredError,
    isLoading: filteredLoading,
  } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/charts/projects_by_registration_date`,
      useDebounce(registry),
      useDebounce(category),
      complianceOnly,
      useDebounce(search),
      useDebounce(registrationBounds),
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

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
        <Chart x={[2000, 2023]} y={range} padding={{ left: 0 }}>
          <Ticks bottom />
          <TickLabels bottom />
          <TickLabels left values={[0, 1200]} />
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
