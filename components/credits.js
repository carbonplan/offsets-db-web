import { FadeIn } from '@carbonplan/components'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { Box, Divider } from 'theme-ui'

import { Loading, TableHead, TableRow } from './table'
import { useDebounce } from './utils'
import CreditRow from './credit-row'
import CreditCharts from './charts/credit-charts'
import { useQueries } from './queries'
import Pagination from './pagination'
import SummaryRow from './table/summary-row'

const fetcher = ([
  url,
  page,
  sort,
  transactionType,
  transactionBounds,
  registry,
  category,
  complianceOnly,
  search,
  project_id,
  countries,
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

  if (sort) {
    params.append('sort', sort)
  }

  if (project_id) {
    params.append('project_id', project_id)
  }

  if (countries) {
    countries.forEach((country) => params.append('country', country))
  }

  if (transactionType) {
    params.append('transaction_type', transactionType)
  }

  if (transactionBounds) {
    params.append('transaction_date_from', `${transactionBounds[0]}-01-01`)
    params.append('transaction_date_to', `${transactionBounds[1]}-01-01`)
  }

  params.append('current_page', page)
  params.append('per_page', 25)

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const Credits = ({ project_id, charts = true, borderTop = true }) => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    transactionBounds,
    countries,
  } = useQueries()
  const [sort, setSort] = useState('transaction_date')
  const [page, setPage] = useState(1)
  const [transactionType, setTransactionType] = useState(null)
  const { data, error, isLoading } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/credits/`,
      page,
      useDebounce(sort, 10),
      useDebounce(transactionType, 10),
      useDebounce(transactionBounds, 10),
      useDebounce(registry),
      useDebounce(category),
      complianceOnly,
      useDebounce(search),
      project_id,
      countries,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  const { data: unfilteredData } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/credits/`,
      1,
      null,
      null,
      null,
      {},
      {},
      false,
      null,
      project_id,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    setPage(1)
  }, [
    sort,
    transactionType,
    transactionBounds,
    registry,
    category,
    complianceOnly,
    search,
  ])

  return (
    <>
      {charts && (
        <Box sx={{ display: ['none', 'block', 'block', 'block'] }}>
          <Divider
            sx={{
              ml: [-4, -5, -5, -6],
              mr: [-4, -5, 0, 0],
              my: 3,
            }}
          />
          <CreditCharts setTransactionType={setTransactionType} />
        </Box>
      )}
      <Box as='table' sx={{ width: '100%' }}>
        <TableHead
          sort={sort}
          setSort={setSort}
          values={[
            { value: 'transaction_date', label: 'Date', width: [2, 1, 1, 1] },
            {
              value: 'transaction_type',
              label: 'Type',
              width: project_id ? [0, 3, 3, 3] : [0, 1, 1, 1],
            },
            ...(project_id
              ? []
              : [{ value: 'project_id', label: 'Project ID', width: 2 }]),
            { value: 'quantity', label: 'Quantity', width: 1 },
          ]}
          borderTop={borderTop}
        />
        {data && (
          <FadeIn as='tbody'>
            {unfilteredData && (
              <SummaryRow
                count={data.pagination.total_entries}
                total={unfilteredData.pagination.total_entries}
                label='transactions'
              />
            )}
            {data.data.map((d) => (
              <CreditRow
                key={d.transaction_serial_number}
                event={d}
                projectView={!!project_id}
              />
            ))}
            {data.data.length === 0 ? (
              <TableRow
                values={[
                  {
                    label: 'No results found',
                    key: 'empty',
                    width: [6, 8, 8, 8],
                  },
                ]}
              />
            ) : null}
          </FadeIn>
        )}

        {isLoading && (
          <FadeIn as='tbody'>
            <Loading
              values={[
                { key: 'transaction_date', width: [2, 1, 1, 1] },
                {
                  key: 'transaction_type',
                  width: project_id ? [0, 3, 3, 3] : [0, 1, 1, 1],
                },
                ...(project_id ? [] : [{ key: 'project_id', width: 2 }]),
                { key: 'quantity', width: 1 },
              ]}
            />
          </FadeIn>
        )}
      </Box>
      {data && <Pagination pagination={data.pagination} setPage={setPage} />}
    </>
  )
}

export default Credits
