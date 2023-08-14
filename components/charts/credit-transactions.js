import { Chart, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { useCallback, useMemo } from 'react'
import { alpha } from '@theme-ui/color'

import Brush from './brush'
import Heatmap, { mungeData } from './heatmap'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'

const fetcher = ([
  url,
  type,
  registry = {},
  category = {},
  complianceOnly,
  search,
  transactionBounds,
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
    params.append('registered_at_from', `${transactionBounds[0]}-01-01`)
    params.append('registered_at_to', `${transactionBounds[1]}-12-31`)
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const CreditTransactions = ({ transactionType, setTransactionType }) => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    transactionBounds,
    setTransactionBounds,
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
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  const points = useMemo(() => {
    const max = data ? Math.max(...data.map((d) => d.value)) : 0
    return [
      ...Array(24)
        .fill(null)
        .map((a, i) =>
          Array(9)
            .fill(null)
            .map((d, j) => ({
              color: !!transactionBounds ? alpha('muted', 0.5) : 'muted',
              value: [2000 + i, j],
              key: 'background',
            }))
        )
        .flat(),
      ...mungeData(data, theme, max, 'all', 'secondary'),
      ...mungeData(filteredData, theme, max, 'filtered', null),
    ]
  }, [data, filteredData, theme, !!transactionBounds])

  const handleBoundsChange = useCallback(
    (bounds) => {
      setTransactionBounds(bounds)
      setTransactionType(bounds ? transactionType : null)
    },
    [transactionType, setTransactionBounds]
  )

  return (
    <>
      <Flex sx={{ gap: 3 }}>
        Credits {transactionType === 'issuance' ? 'issued' : 'retired'} / year
        <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
          {transactionBounds ? transactionBounds.join(' - ') : 'Drag to filter'}
        </Box>
      </Flex>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart x={[2000, 2023]} y={[-0.5, 8.45]} padding={{ left: 0 }}>
          <Ticks bottom />
          <TickLabels bottom />
          <Grid vertical />
          <Plot>
            <Brush setBounds={handleBoundsChange} />
            <Heatmap data={points} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default CreditTransactions
