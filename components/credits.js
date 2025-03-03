import { Badge, FadeIn } from '@carbonplan/components'
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
import { formatValue } from './utils'
import useFetcher from './use-fetcher'
import CreditRow from './credit-row'
import Pagination from './pagination'
import TooltipWrapper from './tooltip-wrapper'
import BeneficiaryHeading from './beneficiary-heading'

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

const Credits = ({ project_id, transactionType, color, borderTop = true }) => {
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
    transactionType,
  })
  const { data: unfilteredData } = useFetcher('credits/', {
    filters: false,
    page: 1,
    project_id,
    transactionType,
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

  return (
    <Box as='table' sx={{ width: '100%' }}>
      <TableHead
        color={color}
        columns={project_id ? [6, 6, 7, 7] : [6, 8, 8, 8]}
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
            width: [1, 1, 2, 2],
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
            value: 'transaction_type',
            label: 'Type',
            width: [0, 1, 1, 1],
          },
          {
            value: 'beneficiary',
            label: <BeneficiaryHeading sx={sx.tooltip} color={color} />,
            width: 2,
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
              columns={[6, 6, 7, 7]}
              sx={{ minHeight: [0, 200, 200, 200] }}
              values={[
                {
                  label: 'No results found',
                  key: 'empty',
                  width: [6, 6, 7, 7],
                },
              ]}
            />
          ) : null}
        </FadeIn>
      )}

      {isLoading && (
        <FadeIn as='tbody'>
          <LoadingState
            columns={[6, 6, 7, 7]}
            values={[
              { key: 'transaction_date', width: [1, 1, 2, 2] },
              { key: 'quantity', width: 1 },
              {
                value: 'vintage',
                width: [project_id ? 1 : 0, 1, 1, 1],
              },
              {
                key: 'transaction_type',
                width: [0, 1, 1, 1],
              },
              { key: 'beneficiary', width: 2 },
              ...(project_id ? [] : [{ key: 'project_id', width: 2 }]),
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
        columns={project_id ? [6, 6, 7, 7] : [6, 8, 8, 8]}
        values={[
          {
            label: (
              <Flex sx={sx.footerLabel}>
                Total
                <Badge sx={{ color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {unfilteredData
                    ? formatValue(unfilteredData.pagination.total_entries)
                    : '-'}
                </Badge>
              </Flex>
            ),
            key: 'total',
            start: 1,
            width: [2, 2, 2, 2],
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
            start: [3, 5, 5, 5],
            width: [4, 4, 4, 4],
          },
        ]}
      />
    </Box>
  )
}

export default Credits
