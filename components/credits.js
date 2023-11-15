import { Badge, FadeIn } from '@carbonplan/components'
import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Loading, TableFoot, TableHead, TableRow } from './table'
import CreditRow from './credit-row'
import CreditCharts from './charts/credit-charts'
import { useQueries } from './queries'
import Pagination from './pagination'
import useFetcher from './use-fetcher'
import { formatValue } from './utils'

const Credits = ({
  project_id,
  transactionType: transactionTypeProp,
  charts = true,
  borderTop = true,
}) => {
  const { registry, category, complianceOnly, search, transactionBounds } =
    useQueries()
  const [sort, setSort] = useState('-transaction_date')
  const [page, setPage] = useState(1)
  const [transactionType, setTransactionType] = useState(transactionTypeProp)
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

  useEffect(() => {
    setTransactionType(transactionTypeProp)
  }, [transactionTypeProp])

  return (
    <>
      {charts && (
        <Box sx={{ display: ['none', 'block', 'block', 'block'], mt: 3 }}>
          <CreditCharts setTransactionType={setTransactionType} />
        </Box>
      )}
      <Box as='table' sx={{ width: '100%' }}>
        <TableHead
          sort={sort}
          setSort={setSort}
          values={[
            { value: 'transaction_date', label: 'Date', width: 2 },
            {
              value: 'vintage',
              label: 'Vintage',
              width: [project_id ? 1 : 0, 1, 1, 1],
            },
            {
              value: 'transaction_type',
              label: 'Type',
              width: project_id ? [0, 3, 3, 3] : [0, 2, 2, 2],
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
            {data.data.map((d) => (
              <CreditRow key={d.id} event={d} projectView={!!project_id} />
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
                { key: 'transaction_date', width: 2 },
                {
                  value: 'vintage',
                  width: [project_id ? 1 : 0, 1, 1, 1],
                },

                {
                  key: 'transaction_type',
                  width: project_id ? [0, 3, 3, 3] : [0, 2, 2, 2],
                },
                ...(project_id ? [] : [{ key: 'project_id', width: 2 }]),
                { key: 'quantity', width: 1 },
              ]}
            />
          </FadeIn>
        )}
        <TableFoot
          values={[
            {
              label: (
                <Flex
                  sx={{
                    gap: 3,
                    alignItems: 'baseline',
                    color: 'secondary',
                    textTransform: 'uppercase',
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Total
                  <Badge sx={{ whiteSpace: 'nowrap' }}>
                    {unfilteredData
                      ? formatValue(unfilteredData.pagination.total_entries)
                      : '-'}
                  </Badge>
                </Flex>
              ),
              key: 'total',
              start: 1,
              width: [3, 2, 2, 2],
            },
            {
              label: (
                <Flex
                  sx={{
                    gap: 3,
                    alignItems: 'baseline',
                    color: 'secondary',
                    textTransform: 'uppercase',
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Selected
                  <Badge sx={{ flexShrink: 0 }}>
                    {data ? formatValue(data.pagination.total_entries) : '-'}
                  </Badge>
                </Flex>
              ),
              key: 'selected',
              start: [4, 3, 3, 3],
              width: [3, 2, 2, 2],
            },
            {
              label: (
                <Flex
                  sx={{
                    justifyContent: [
                      'flex-start',
                      'flex-end',
                      'flex-end',
                      'flex-end',
                    ],
                  }}
                >
                  <Pagination
                    pagination={data?.pagination}
                    setPage={setPage}
                    isLoading={isLoading}
                  />
                </Flex>
              ),
              key: 'pagination',
              start: [1, 5, 5, 5],
              width: [6, 4, 4, 4],
            },
          ]}
        />
      </Box>
    </>
  )
}

export default Credits
