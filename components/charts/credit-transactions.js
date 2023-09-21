import { Chart, Bar, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { useCallback, useMemo } from 'react'

import Brush from './brush'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'
import { format } from 'd3-format'

const fetcher = ([
  url,
  type,
  registry = {},
  category = {},
  complianceOnly,
  search,
  transactionBounds,
  countries,
]) => {
  const params = new URLSearchParams()
  params.append('transaction_type', type)

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
  if (transactionBounds) {
    params.append('transaction_date_from', `${transactionBounds[0]}-01-01`)
    params.append('transaction_date_to', `${transactionBounds[1]}-12-31`)
  }

  if (countries) {
    countries.forEach((country) => params.append('country', country))
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const CreditTransactions = ({
  project_id, // TODO: thread this through to queries
  transactionType,
  setTransactionType,
}) => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    transactionBounds,
    setTransactionBounds,
    countries,
  } = useQueries()
  const { theme } = useThemeUI()
  const { data, error, isLoading } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/charts/credits_by_transaction_date`,
      transactionType,
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
      `${process.env.NEXT_PUBLIC_API_URL}/charts/credits_by_transaction_date`,
      transactionType,
      useDebounce(registry),
      useDebounce(category),
      complianceOnly,
      useDebounce(search),
      useDebounce(transactionBounds),
      countries,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

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
