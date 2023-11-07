import { FadeIn } from '@carbonplan/components'
import { useEffect, useState } from 'react'
import { Box, Divider } from 'theme-ui'

import ProjectCharts from './charts/project-charts'
import Pagination from './pagination'
import ProjectRow from './project-row'
import { useQueries } from './queries'
import { Loading, TableHead, TableRow } from './table'
import SummaryRow from './table/summary-row'
import useFetcher from './use-fetcher'
import { projectSorters } from './utils'

const Projects = () => {
  const { registry, category, complianceOnly, search, listingBounds } =
    useQueries()
  const [sort, setSort] = useState('-issued')
  const [page, setPage] = useState(1)
  const { data, error, isLoading } = useFetcher('projects/', {
    page,
    sort,
  })

  const { data: unfilteredData } = useFetcher('projects/', {
    filters: false,
    page: 1,
  })

  useEffect(() => {
    setPage(1)
  }, [registry, category, complianceOnly, search, sort, listingBounds])

  return (
    <>
      <Box sx={{ display: ['none', 'block', 'block', 'block'] }}>
        <Divider
          sx={{
            ml: [-4, -5, -5, -6],
            mr: [-4, -5, 0, 0],
            my: 3,
          }}
        />
        <ProjectCharts />
      </Box>
      <Box as='table' sx={{ width: '100%' }}>
        <TableHead
          sort={sort}
          setSort={setSort}
          values={[
            { value: 'project_id', label: 'Project ID', width: [2, 1, 1, 1] },
            { value: 'name', label: 'Name', width: 3 },
            { value: 'issued', label: 'Issued', width: [0, 1, 1, 1] },
            { value: 'retired', label: 'Retired', width: [0, 1, 1, 1] },
            { value: 'listed_at', label: 'Listed', width: [2, 1, 1, 1] },
            { value: 'details', label: 'Details', width: [2, 1, 1, 1] },
          ]}
        />
        {data && (
          <FadeIn as='tbody'>
            {unfilteredData && (
              <SummaryRow
                count={data.pagination.total_entries}
                total={unfilteredData.pagination.total_entries}
                label='projects'
              />
            )}

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
            <Loading
              values={[
                { key: 'project_id', width: [2, 1, 1, 1] },
                { key: 'name', width: 3 },
                { key: 'issued', width: [0, 1, 1, 1] },
                { key: 'retired', width: [0, 1, 1, 1] },
                { key: 'listed_at', width: [2, 1, 1, 1] },
                {
                  key: 'details',
                  width: [0, 1, 1, 1],
                },
              ]}
            />
          </FadeIn>
        )}
      </Box>
      {data && <Pagination pagination={data.pagination} setPage={setPage} />}
    </>
  )
}

export default Projects
