import { Chart, Grid, Plot, Ticks, TickLabels, Bar } from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { useMemo } from 'react'

import Brush from './brush'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'
import { format } from 'd3-format'

const fetcher = ([
  url,
  creditType,
  registry = {},
  category = {},
  complianceOnly,
  search,
  registrationBounds,
  issuedBounds,
  countries,
]) => {
  const params = new URLSearchParams()
  if (creditType) {
    params.append('credit_type', creditType)
  }

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

  if (issuedBounds) {
    params.append('issued_min', issuedBounds[0])
    params.append('issued_max', issuedBounds[1])
  }

  if (countries) {
    countries.forEach((country) => params.append('country', country))
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const ProjectCredits = ({ creditType = 'issued' }) => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    issuedBounds,
    setIssuedBounds,
    registrationBounds,
    countries,
  } = useQueries()
  const { theme } = useThemeUI()
  const { data, error, isLoading } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/charts/projects_by_credit_totals`,
      creditType,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )
  const {
    data: filteredData,
    error: filteredError,
    isLoading: filteredLoading,
  } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/charts/projects_by_credit_totals`,
      creditType,
      useDebounce(registry),
      useDebounce(category),
      complianceOnly,
      useDebounce(search),
      useDebounce(registrationBounds),
      useDebounce(issuedBounds),
      countries,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  const { lines, range, domain } = useMemo(() => {
    if (!data) {
      return { lines: [], range: [0, 0], domain: [0, 0] }
    } else {
      const lines = data
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

      const range = lines.reduce(
        ([min, max], d) => [Math.min(min, d[1]), Math.max(max, d[1])],
        [Infinity, -Infinity]
      )
      const domain = lines.reduce(
        ([min, max], d) => [Math.min(min, d[0]), Math.max(max, d[0])],
        [Infinity, -Infinity]
      )
      return { lines, range, domain }
    }
  }, [data])

  const { lines: filteredLines } = useMemo(() => {
    if (!filteredData) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = filteredData
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
