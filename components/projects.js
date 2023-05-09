import { Column, Row } from '@carbonplan/components'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

const TableRow = ({ values, as, sx }) => {
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
          {value?.label ?? value}
        </Column>
      ))}
    </Row>
  )
}

const TableHead = ({ values }) => {
  return (
    <thead>
      <TableRow as='th' values={values} />
    </thead>
  )
}

const Projects = () => {
  const { data, error, isLoading } = useSWR(
    'https://offsets-db.fly.dev/projects',
    fetcher
  )

  if (!data) return

  return (
    <table>
      <TableHead
        values={[
          'Project ID',
          { label: 'Name', width: 4 },
          'Country',
          'Registered',
        ]}
      />
      <tbody>
        {data.map((d) => (
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
      </tbody>
    </table>
  )
}

export default Projects
