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
import { alpha } from '@theme-ui/color'
import { useBreakpointIndex } from '@theme-ui/match-media'
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

const fillBars = (lines, domain, range) => {
  const xMap = new Map(lines)
  const result = []
  for (let year = domain[0]; year <= domain[1]; year++) {
    const value = xMap.has(year) ? xMap.get(year) : 0

    // ensure that a sliver of bar is visible for values that are low relative to range
    const perceivedValue = value > 0 ? Math.max(range[1] * 0.01, value) : value
    result.push([year, perceivedValue])
  }

  return result
}

const CreditTransactions = ({
  project_id,
  color,
  transactionType,
  domain: domainProp,
  setDomain,
  range: rangeProp,
  setRange,
  hideLeftTickLabels = false,
}) => {
  const url = `charts/credits_by_transaction_date${
    project_id ? '/' + project_id : ''
  }`
  const { data, error, isLoading } = useFetcher(url, {
    transactionType,
    filters: false,
  })
  const index = useBreakpointIndex({ defaultIndex: 2 })
  const lines = useMemo(() => {
    if (!data) {
      return []
    } else {
      return getLines(data.data)
    }
  }, [data])

  const { domain, range } = useMemo(() => {
    let d = lines.reduce(
      ([min, max], d) => [Math.min(min, d[0]), Math.max(max, d[0])],
      domainProp ?? [Infinity, -Infinity]
    )

    if (d[0] === d[1]) {
      d = [d[0] - 1, d[1]]
    }

    const r = lines.reduce(
      ([min, max], d) => [Math.min(min, d[1]), Math.max(max, d[1])],
      rangeProp ?? [0, -Infinity]
    )

    return { domain: d, range: r }
  }, [lines, domainProp, rangeProp])

  useEffect(() => {
    if (setDomain) {
      setDomain(domain)
    }
  }, [setDomain, domain])

  useEffect(() => {
    if (setRange) {
      setRange(range)
    }
  }, [setRange, range])

  const { ticks, labels, step } = useMemo(() => {
    if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1])) {
      return { step: 0 }
    }

    const width = domain[1] - domain[0]
    if (width >= 8) {
      return { step: 2 }
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

  const bars = useMemo(
    () => fillBars(lines, domain, range),
    [lines, domain, range]
  )

  return (
    <>
      <Box sx={{ color }}>
        {transactionType === 'issuance' ? 'Issuances' : 'Retirements'} over time
      </Box>
      <Box sx={{ height: ['120px', '150px', '170px', '170px'], mt: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              pb: 50,
            }}
          >
            <Box
              sx={{ width: '100%', height: '100%', bg: alpha('muted', 0.4) }}
            />
          </Box>
        ) : (
          <Chart
            key={`${domain[0]},${domain[1]}`}
            x={[domain[0] - step / 2, domain[1] + step / 2]}
            y={range}
            padding={{ left: index < 1 ? 32 : 0 }}
          >
            <Axis bottom sx={{ borderColor: color }} />
            <Grid vertical values={ticks} />
            <Grid horizontal count={3} />
            <Ticks bottom values={ticks} sx={{ borderColor: color }} />
            <TickLabels bottom values={labels} sx={{ color }} />
            {(!hideLeftTickLabels || index < 1) && (
              <TickLabels left count={3} format={format('~s')} />
            )}
            <Plot>
              <Bar data={bars} color={color} />
            </Plot>
          </Chart>
        )}
      </Box>
    </>
  )
}

export default CreditTransactions
