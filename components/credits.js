import { FadeIn } from '@carbonplan/components'
import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import {
  ErrorState,
  LoadingState,
  TableFoot,
  TableHead,
  TableRow,
} from './table'
import { useQueries } from './queries'
import useFetcher from './use-fetcher'
import CreditRow from './credit-row'
import Pagination from './pagination'
import TooltipWrapper from './tooltip-wrapper'
import BeneficiaryHeading from './beneficiary-heading'
import Quantity from './quantity'

const sx = {
  footerLabel: {
    gap: 3,
    alignItems: 'baseline',
    color: 'secondary',
    textTransform: 'uppercase',
    fontFamily: 'mono',
    letterSpacing: 'mono',
    whiteSpace: 'nowrap',
  },
  tooltip: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
  },
}

const Credits = ({ project_id, color, borderTop = true }) => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    beneficiarySearch,
    transactionBounds,
  } = useQueries()
  const [sort, setSort] = useState('-transaction_date')
  const [page, setPage] = useState(1)
  const { data, error, isLoading } = useFetcher('credits/', {
    page,
    sort,
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
    transactionBounds,
    registry,
    category,
    complianceOnly,
    search,
    beneficiarySearch,
  ])

  const columns = project_id ? [6, 6, 7, 7] : [6, 8, 8, 8]

  return (
    <Box as='table' sx={{ width: '100%', borderCollapse: 'collapse' }}>
      <TableHead
        color={color}
        columns={columns}
        sort={sort}
        setSort={setSort}
        values={[
          ...(project_id
            ? []
            : [
                {
                  value: 'project_id',
                  label: 'Project ID',
                  width: [2, 1, 1, 1],
                },
              ]),
          {
            value: 'transaction_date',
            key: 'transaction_date',
            label: (
              <TooltipWrapper
                sx={sx.tooltip}
                tooltip='Recorded transaction date'
              >
                Date
              </TooltipWrapper>
            ),
            width: [2, 1, 1, 1],
          },
          {
            value: 'transaction_type',
            label: 'Type',
            width: [0, 1, 1, 1],
          },
          {
            value: 'quantity',
            label: 'Quantity',
            width: [2, 1, 1, 1],
          },
          {
            value: 'vintage',
            key: 'vintage',
            label: (
              <TooltipWrapper sx={sx.tooltip} tooltip='Recorded credit vintage'>
                Vintage
              </TooltipWrapper>
            ),
            width: [project_id ? 1 : 0, 1, 1, 1],
          },
          {
            value: 'beneficiary',
            label: project_id ? (
              <BeneficiaryHeading sx={sx.tooltip} color={color} />
            ) : (
              <TooltipWrapper sx={sx.tooltip} tooltip='Retirement beneficiary'>
                Beneficiary
              </TooltipWrapper>
            ),
            width: project_id ? [0, 2, 2, 2] : [0, 3, 3, 3],
          },
        ]}
        borderTop={borderTop}
      />
      {data && (
        <FadeIn as='tbody'>
          {data.data.map((d) => (
            <CreditRow
              color={color}
              key={d.id}
              event={d}
              projectView={!!project_id}
            />
          ))}
          {data.data.length === 0 ? (
            <TableRow
              columns={columns}
              sx={{ minHeight: [0, 200, 200, 200] }}
              values={[
                {
                  label: 'No results found',
                  key: 'empty',
                  width: columns,
                },
              ]}
            />
          ) : null}
        </FadeIn>
      )}

      {isLoading && (
        <FadeIn as='tbody'>
          <LoadingState
            columns={columns}
            values={[
              ...(project_id
                ? []
                : [
                    {
                      key: 'project_id',
                      width: [2, 1, 1, 1],
                    },
                  ]),

              { key: 'transaction_date', width: [2, 1, 1, 1] },
              {
                key: 'transaction_type',
                width: [0, 1, 1, 1],
              },
              { key: 'quantity', width: [2, 1, 1, 1] },
              {
                value: 'vintage',
                width: [project_id ? 1 : 0, 1, 1, 1],
              },
              {
                key: 'beneficiary',
                width: project_id ? [0, 2, 2, 2] : [0, 3, 3, 3],
              },
            ]}
          />
        </FadeIn>
      )}
      {error && (
        <FadeIn as='tbody'>
          <ErrorState error={error} width={6} />
        </FadeIn>
      )}
      <TableFoot
        columns={columns}
        values={[
          {
            label: (
              <Flex sx={sx.footerLabel}>
                Total
                <Quantity
                  sx={{ whiteSpace: 'nowrap' }}
                  value={
                    unfilteredData
                      ? unfilteredData.pagination.total_entries
                      : '-'
                  }
                />
              </Flex>
            ),
            key: 'total',
            start: 1,
            width: [3, 2, 2, 2],
          },
          {
            label: (
              <Flex sx={sx.footerLabel}>
                Selected
                <Quantity
                  sx={{ flexShrink: 0 }}
                  value={data ? data.pagination.total_entries : '-'}
                />
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
                  color={color}
                  pagination={data?.pagination}
                  setPage={setPage}
                  isLoading={isLoading}
                />
              </Flex>
            ),
            key: 'pagination',
            start: [1, 5, 5, 5],
            width: [4, 4, 4, 4],
          },
        ]}
      />
    </Box>
  )
}

export default Credits
