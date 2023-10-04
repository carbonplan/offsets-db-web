import { FadeIn } from '@carbonplan/components'
import { useEffect, useState } from 'react'
import { Box, Divider } from 'theme-ui'

import { Loading, TableHead, TableRow } from './table'
import CreditRow from './credit-row'
import CreditCharts from './charts/credit-charts'
import { useQueries } from './queries'
import Pagination from './pagination'
import SummaryRow from './table/summary-row'
import useFetcher from './use-fetcher'

const Credits = ({ project_id, charts = true, borderTop = true }) => {
  const { registry, category, complianceOnly, search, transactionBounds } =
    useQueries()
  const [sort, setSort] = useState('transaction_date')
  const [page, setPage] = useState(1)
  const [transactionType, setTransactionType] = useState(null)
  const { data, error, isLoading } = useFetcher('credits/', {
    page,
    sort,
    transactionType,
    project_id,
  })
  const { data: unfilteredData } = useFetcher('credits/', {
    filters: false,
    page: 1,
    project_id,
  })

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
