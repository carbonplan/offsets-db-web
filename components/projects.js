import { Badge, Button, FadeIn, formatDate } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import useSWR from 'swr'
import { useState } from 'react'

import { COLORS, LABELS } from './constants'
import { useQueries } from './queries'
import { Loading, TableHead, TableRow } from './table'
import ProjectCharts from './project-charts'

const fetcher = ([
  url,
  registry,
  category,
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

  if (registrationBounds) {
    params.append('registered_at_from', `${registrationBounds[0]}-01-01`)
    params.append('registered_at_to', `${registrationBounds[1]}-01-01`)
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const sorters = {
  default: (sort) => (a, b) => a[sort]?.localeCompare(b[sort]),
  project_id: (a, b) => {
    const values = [a.project_id, b.project_id]
    const prefixes = values.map((d) => d.match(/\D+/)[0])
    const numbers = values.map((d) => d.match(/\d+/)[0])

    if (prefixes[0] !== prefixes[1]) {
      return prefixes[0].localeCompare(prefixes[1])
    } else {
      return Number(numbers[0]) - Number(numbers[1])
    }
  },
}

const Projects = () => {
  const { registry, category, search, registrationBounds } = useQueries()
  const [sort, setSort] = useState('project_id')
  const { data, error, isLoading } = useSWR(
    [
      'https://offsets-db.fly.dev/projects/',
      registry,
      category,
      search,
      sort,
      registrationBounds,
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  return (
    <>
      <ProjectCharts />
      <table>
        <TableHead
          sort={sort}
          setSort={setSort}
          values={[
            { value: 'project_id', label: 'Project ID' },
            { value: 'name', label: 'Name', width: 3 },
            { value: 'country', label: 'Country' },
            { value: 'registered_at', label: 'Registered' },
          ]}
        />
        {data && (
          <FadeIn as='tbody'>
            {data.sort(sorters[sort] ?? sorters.default(sort)).map((d) => (
              <TableRow
                key={d.project_id}
                values={[
                  {
                    label: (
                      <Badge
                        sx={{
                          color: COLORS.category[d.category],
                          '& :first-of-type': {
                            fontFamily: 'body',
                          },
                        }}
                      >
                        {d.project_id}
                      </Badge>
                    ),
                    key: 'project_id',
                  },
                  { key: 'name', label: d.name ?? '?', width: 3 },
                  { key: 'country', label: d.country },
                  {
                    key: 'registered_at',
                    label: d.registered_at
                      ? formatDate(d.registered_at, { year: 'numeric' })
                      : '?',
                  },
                  {
                    key: 'details_url',
                    label: (
                      <Button
                        href={d.details_url}
                        suffix={<RotatingArrow sx={{ mt: '-3px' }} />}
                        inverted
                        sx={{ fontSize: 1 }}
                      >
                        {LABELS.registry[d.registry]}
                      </Button>
                    ),
                  },
                ]}
              />
            ))}
          </FadeIn>
        )}

        {isLoading && (
          <FadeIn as='tbody'>
            <Loading
              values={[
                {
                  key: 'project_id',
                },
                { key: 'name', width: 3 },
                { key: 'country' },
                {
                  key: 'registered_at',
                },
                {
                  key: 'details_url',
                },
              ]}
            />
          </FadeIn>
        )}
      </table>
    </>
  )
}

export default Projects
