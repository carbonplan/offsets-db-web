import { Column, Row } from '@carbonplan/components'
import { Chart, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { useMemo } from 'react'
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

const EventCharts = ({ transactionType, setTransactionType }) => {
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
      'issuance',
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
      'issuance',
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
      ...mungeData(data, theme, 1e8, 'all', 'secondary'),
      ...mungeData(filteredData, theme, 1e8, 'filtered', null),
    ]
  }, [data, filteredData, theme, !!transactionBounds])

  return (
    <Row
      columns={[6, 8, 8, 8]}
      sx={{
        color: 'primary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        textTransform: 'uppercase',
      }}
    >
      <Column start={1} width={[6, 4, 4, 4]}>
        <Flex sx={{ gap: 3 }}>
          Credits issued / year
          <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
            {transactionBounds
              ? transactionBounds.join(' - ')
              : 'Drag to filter'}
          </Box>
        </Flex>
        <Box sx={{ height: '200px', mt: 3 }}>
          <Chart x={[2000, 2023]} y={[-0.5, 8.45]} padding={{ left: 0 }}>
            <Ticks bottom />
            <TickLabels bottom />
            <Grid vertical />
            <Plot>
              <Brush setBounds={setTransactionBounds} />
              <Heatmap data={points} />
            </Plot>
          </Chart>
        </Box>
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
        <Flex sx={{ gap: 3 }}>
          Credits retired / year
          <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
            {transactionBounds
              ? transactionBounds.join(' - ')
              : 'Drag to filter'}
          </Box>
        </Flex>
        <Box sx={{ height: '200px', mt: 3 }}>
          <Chart x={[2000, 2023]} y={[0, 6]} padding={{ left: 0 }}>
            <Ticks bottom />
            <TickLabels bottom />
            <Grid vertical />
            <Plot>
              <Brush
                clear={transactionType === 'issuance'}
                setBounds={(value) => {
                  setTransactionBounds(value)
                  setTransactionType(value ? 'retirement' : null)
                }}
              />
            </Plot>
          </Chart>
        </Box>
      </Column>
    </Row>
  )
}

export default EventCharts
