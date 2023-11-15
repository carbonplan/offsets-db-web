import {
  Chart,
  Bar,
  Grid,
  Plot,
  Ticks,
  TickLabels,
  Axis,
} from '@carbonplan/charts'
import { Box } from 'theme-ui'
import { useEffect, useMemo } from 'react'
import { format } from 'd3-format'

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
}

const fillBars = (lines, domain) => {
  const xMap = new Map(lines)
  const result = []
  for (let year = domain[0]; year <= domain[1]; year++) {
    const value = xMap.has(year) ? xMap.get(year) : 0
    result.push([year, value])
  }

  return result
}

const CreditTransactions = ({
  project_id,
  color,
  transactionType,
  domain: domainProp,
  setDomain,
}) => {
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

  const { lines, range } = useMemo(() => {
    if (!data) {
      return { lines: [], range: [0, 0], domain: [1999, 2023] }
    } else {
      const lines = getLines(data.data)

      const range = lines.reduce(
        ([min, max], d) => [Math.min(min, d[1]), Math.max(max, d[1])],
        [0, -Infinity]
      )
      return { lines, range }
    }
  }, [data])

  const domain = useMemo(() => {
    const d = lines.reduce(
      ([min, max], d) => [Math.min(min, d[0]), Math.max(max, d[0])],
      domainProp ?? [Infinity, -Infinity]
    )
    if (d[0] === d[1]) {
      return [d[0] - 1, d[1]]
    }

    return d
  }, [lines, domainProp])

  useEffect(() => {
    if (setDomain) {
      setDomain(domain)
    }
  }, [setDomain, domain])

  const { lines: filteredLines } = useMemo(() => {
    if (!filteredData) {
      return { lines: [], range: [0, 0] }
    } else {
      const lines = getLines(filteredData.data)

      return { lines }
    }
  }, [filteredData])

  const { ticks, labels, step } = useMemo(() => {
    if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1])) {
      return { step: 0 }
    }

    const width = domain[1] - domain[0]
    if (width >= 8) {
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

  const { bars, filteredBars } = useMemo(() => {
    return {
      bars: fillBars(lines, domain),
      filteredBars: fillBars(filteredLines, domain),
    }
  }, [lines, filteredLines, domain])

  return (
    <>
      <Box sx={{ color }}>
        {transactionType === 'issuance' ? 'Issuances' : 'Retirements'} over time
      </Box>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart
          key={`${domain[0]},${domain[1]}`}
          x={[domain[0] - step / 2, domain[1] + step / 2]}
          y={range}
          padding={{ left: 32 }}
        >
          <Axis bottom sx={{ borderColor: color }} />
          <Grid vertical values={ticks} />
          <Ticks bottom values={ticks} sx={{ borderColor: color }} />
          <TickLabels bottom values={labels} sx={{ color }} />
          <TickLabels left count={3} format={format('~s')} />
          <Plot>
            <Bar data={bars} color='secondary' />
            <Bar data={filteredBars} color={color} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default CreditTransactions
