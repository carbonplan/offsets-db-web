import { Badge, FadeIn } from '@carbonplan/components'
import { useEffect, useRef } from 'react'
import { Box, Flex } from 'theme-ui'

import {
  ErrorState,
  LoadingState,
  TableFoot,
  TableHead,
  TableRow,
} from './table'
import { useQueries } from './queries'
import { formatValue, projectSorters } from './utils'
import ProjectCharts from './charts/project-charts'
import Pagination from './pagination'
import ProjectRow from './project-row'
import TooltipWrapper from './tooltip-wrapper'
import useFetcher from './use-fetcher'

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

const Projects = () => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    listingBounds,
    page,
    setPage,
    sort,
    setSort,
  } = useQueries()
  const initialized = useRef(false)

  const { data, error, isLoading } = useFetcher('projects/', {
    page,
    sort,
  })

  const { data: unfilteredData } = useFetcher('projects/', {
    filters: false,
    page: 1,
  })

  useEffect(() => {
    if (initialized.current) {
      setPage(1)
    }
    initialized.current = true
  }, [registry, category, complianceOnly, search, sort, listingBounds])

  return (
    <>
      <Box sx={{ display: ['none', 'block', 'block', 'block'] }}>
        <ProjectCharts />
      </Box>
      <Box as='table' sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHead
          sort={sort}
          setSort={setSort}
          values={[
            { value: 'project_id', label: 'Project ID', width: [2, 1, 1, 1] },
            { value: 'name', label: 'Name', width: 3 },
            {
              value: 'issued',
              key: 'issued',
              label: (
                <TooltipWrapper
                  tooltip='Number of credits issued'
                  sx={sx.tooltip}
                >
                  Issued
                </TooltipWrapper>
              ),
              width: [0, 1, 1, 1],
            },
            {
              value: 'retired',
              key: 'retired',
              label: (
                <TooltipWrapper
                  tooltip='Number of credits retired'
                  sx={sx.tooltip}
                >
                  Retired
                </TooltipWrapper>
              ),
              width: [0, 1, 1, 1],
            },
            {
              value: 'details',
              label: 'Details',
              start: [1, 8, 8, 8],
              width: [0, 1, 1, 1],
            },
          ]}
          borderTop
        />
        {data && (
          <FadeIn as='tbody'>
            {data.data
              .sort(projectSorters[sort] ?? projectSorters.default(sort))
              .map((d) => (
                <ProjectRow key={d.project_id} project={d} />
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
            <LoadingState
              values={[
                { key: 'project_id', width: [2, 1, 1, 1] },
                { key: 'name', width: 3 },
                { key: 'issued', width: [0, 1, 1, 1] },
                { key: 'retired', width: [0, 1, 1, 1] },
                { key: 'listed_at', width: [0, 1, 1, 1] },
                {
                  key: 'details',
                  width: [0, 1, 1, 1],
                },
              ]}
            />
          </FadeIn>
        )}
        {error && (
          <FadeIn as='tbody'>
            <ErrorState error={error} width={[6, 8, 8, 8]} />
          </FadeIn>
        )}
        <TableFoot
          values={[
            {
              label: (
                <Flex sx={sx.footerLabel}>
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
                <Flex sx={sx.footerLabel}>
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
                    minHeight: 40,
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

export default Projects
