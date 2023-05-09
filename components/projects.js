import { Column, FadeIn, Row } from '@carbonplan/components'
import { Triangle } from '@carbonplan/icons'
import useSWR from 'swr'
import { Box } from 'theme-ui'
import { useCallback, useState } from 'react'
import { useQueries } from './queries'

const fetcher = ([url, registries]) => {
  const params = new URLSearchParams()
  Object.keys(registries)
    .filter((r) => registries[r])
    .forEach((r) => params.append('registry', r))

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

const TableRow = ({ values, as, sx, Button }) => {
  const starts = values.reduce((accum, v, i) => {
    if (accum.length === 0) {
      accum.push(1)
    } else {
      const prevWidth = values[i - 1].width ?? 1
      accum.push(accum[accum.length - 1] + prevWidth)
    }
    return accum
  }, [])

  return (
    <Row as='tr' columns={[6, 8, 8, 8]}>
      {values.map((value, i) => (
        <Column
          as={value?.as ?? as ?? 'td'}
          key={value?.label ?? value}
          start={starts[i]}
          width={value?.width ?? 1}
          sx={{ fontSize: 1, textAlign: 'left', ...sx }}
        >
          {Button && <Button value={value} />}
          {value?.label ?? value}
        </Column>
      ))}
    </Row>
  )
}

const TableHead = ({ values, sort, setSort }) => {
  const Sort = useCallback(
    ({ value }) => {
      return (
        <Box
          as='button'
          sx={{
            width: '16px',
            height: '16px',
            bg: 'transparent',
            border: 'none',
            p: 0,
            m: 0,
            display: 'block',
            cursor: 'pointer',
            '@media (hover: hover) and (pointer: fine)': {
              [`&:hover #${value.value}-triangle`]: {
                stroke: 'primary',
              },
            },
          }}
          onClick={() => setSort(value.value)}
        >
          <Triangle
            id={`${value.value}-triangle`}
            sx={{
              transition: 'stroke 0.15s',
              stroke: sort === value.value ? 'primary' : 'muted',
              fill: 'none',
              width: 10,
              height: 10,
            }}
          />
        </Box>
      )
    },
    [sort]
  )

  return (
    <thead>
      <TableRow as='th' values={values} Button={Sort} />
    </thead>
  )
}

const Projects = () => {
  const { registry } = useQueries()
  const [sort, setSort] = useState('project_id')
  const { data, error, isLoading } = useSWR(
    ['https://offsets-db.fly.dev/projects/', registry],
    fetcher
  )

  return (
    <table>
      <TableHead
        sort={sort}
        setSort={setSort}
        values={[
          { value: 'project_id', label: 'Project ID' },
          { value: 'name', label: 'Name', width: 4 },
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
                d.project_id,
                { label: d.name, width: 4 },
                d.country,
                d.registered_at,
              ]}
              sx={{
                color: 'secondary',
                fontFamily: 'mono',
                letterSpacing: 'mono',
              }}
            />
          ))}
        </FadeIn>
      )}
    </table>
  )
}

export default Projects
