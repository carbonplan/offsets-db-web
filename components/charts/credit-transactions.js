import { Chart, Bar, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import { useCallback, useEffect, useMemo } from 'react'
import { format } from 'd3-format'

import Brush from './brush'
import { useQueries } from '../queries'
import useFetcher from '../use-fetcher'

const getLines = (data) => {
  return data
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
    .sort((a, b) => a[0] - b[0])
    .reduce((accum, [year, value]) => {
      if (accum.length === 0 || accum[accum.length - 1][0] === year - 1) {
        accum.push([year, value])
      } else {
        for (let i = accum[accum.length - 1][0] + 1; i < year; i++) {
          accum.push([i, 0])
        }
        accum.push([year, value])
      }

      return accum
    }, [])
}

const CreditTransactions = ({
  project_id,
  transactionType,
  setTransactionType,
  domain: domainProp,
  setDomain,
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
      return { lines: [], range: [0, 0], domain: [1999, 2023] }
    } else {
      const lines = getLines(data)

      const range = lines.reduce(
        ([min, max], d) => [Math.min(min, d[1]), Math.max(max, d[1])],
        [Infinity, -Infinity]
      )
      return { lines, range }
    }
  }, [data])

  const domain = useMemo(
    () =>
      lines.reduce(
        ([min, max], d) => [Math.min(min, d[0]), Math.max(max, d[0])],
        domainProp ?? [Infinity, -Infinity]
      ),
    [lines, domainProp]
  )

  useEffect(() => {
    if (setDomain) {
      setDomain(domain)
    }
  }, [setDomain, domain])

  const { lines: filteredLines } = useMemo(() => {
    if (!filteredData) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = getLines(filteredData)

      return { lines }
    }
  }, [filteredData])

  const { ticks, labels, step } = useMemo(() => {
    if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1])) {
      return { step: 0 }
    }

    const width = domain[1] - domain[0]
    if (width >= 6) {
      return { step: 0 }
    }

    const step = 1

    // Define custom ticks and labels when every year is labeled
    const labels = Array(width + step)
      .fill(null)
      .map((d, i) => domain[0] + i)
      .filter((d) => d % step === 0)

    const ticks = Array(width + step)
      .fill(null)
      .map((d, i) => domain[0] - step / 2 + i)
      .filter((d) => (d + step / 2) % step === 0)

    return { ticks, labels, step }
  }, [domain])

  return (
    <>
      <Flex sx={{ gap: 3 }}>
        Credits {transactionType === 'issuance' ? 'issued' : 'retired'} / year
        <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
          {transactionBounds ? transactionBounds.join(' - ') : 'Drag to filter'}
        </Box>
      </Flex>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart
          key={`${domain[0]},${domain[1]}`}
          x={[domain[0] - step / 2, domain[1] + step / 2]}
          y={range}
          padding={{ left: 32 }}
        >
          <Grid vertical values={ticks} />
          <Ticks bottom values={ticks} />
          <TickLabels bottom values={labels} />
          <TickLabels left count={3} format={format('~s')} />
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
