import { Badge, FadeIn } from '@carbonplan/components'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { Box, Divider } from 'theme-ui'

import { useQueries } from './queries'
import { Loading, TableHead, TableRow } from './table'
import ProjectCharts from './charts/project-charts'
import { projectSorters, useDebounce } from './utils'
import Project from './project'
import Pagination from './pagination'
import SummaryRow from './table/summary-row'

const fetcher = ([
  url,
  page,
  registry,
  category,
  complianceOnly,
  search,
  sort,
  registrationBounds,
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

  if (sort) {
    params.append('sort', sort)
  }

  if (complianceOnly) {
    params.append('is_arb', complianceOnly)
  }
  if (registrationBounds) {
    params.append('registered_at_from', `${registrationBounds[0]}-01-01`)
    params.append('registered_at_to', `${registrationBounds[1]}-12-31`)
  }

  params.append('current_page', page)
  params.append('per_page', 25)

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const empty = {}

const Projects = () => {
  const { registry, category, complianceOnly, search, registrationBounds } =
    useQueries()
  const [sort, setSort] = useState('project_id')
  const [page, setPage] = useState(1)
  const { data, error, isLoading } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/projects/`,
      page,
      useDebounce(registry),
      useDebounce(category),
      complianceOnly,
      useDebounce(search),
      useDebounce(sort, 10),
      useDebounce(registrationBounds),
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  const { data: unfilteredData } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/projects/`,
      1,
      empty,
      empty,
      false,
      null,
      null,
      null,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    setPage(1)
  }, [registry, category, complianceOnly, search, sort, registrationBounds])

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
            {
              value: 'registered_at',
              label: 'Registered',
              width: [0, 1, 1, 1],
            },
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
                <Project key={d.project_id} project={d} />
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
                {
                  key: 'registered_at',
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
