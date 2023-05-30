import { FadeIn } from '@carbonplan/components'
import useSWR from 'swr'
import { useState } from 'react'
import { Box, Divider } from 'theme-ui'

import { Loading, TableHead, TableRow } from './table'
import { useDebounce } from './utils'
import Event from './event'

const fetcher = ([url, sort]) => {
  const params = new URLSearchParams()
  // Object.keys(registry)
  //   .filter((r) => registry[r])
  //   .forEach((r) => params.append('registry', r))

  // Object.keys(category)
  //   .filter((c) => category[c])
  //   .forEach((c) => params.append('category', c))

  // if (search?.trim()) {
  //   params.append('search', search.trim())
  // }

  if (sort) {
    params.append('sort', sort)
  }

  // if (complianceOnly) {
  //   params.append('is_arb', complianceOnly)
  // }
  // if (registrationBounds) {
  //   params.append('registered_at_from', `${registrationBounds[0]}-01-01`)
  //   params.append('registered_at_to', `${registrationBounds[1]}-01-01`)
  // }

  params.append('limit', 50)

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const Events = () => {
  const [sort, setSort] = useState('transaction_date')
  const { data, error, isLoading } = useSWR(
    [`${process.env.NEXT_PUBLIC_API_URL}/credits/`, useDebounce(sort, 10)],
    fetcher,
    { revalidateOnFocus: false }
  )

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
        {/* <ProjectCharts /> */}
        TK
      </Box>
      <Box as='table' sx={{ width: '100%' }}>
        <TableHead
          sort={sort}
          setSort={setSort}
          values={[
            { value: 'transaction_date', label: 'Date', width: [2, 1, 1, 1] },
            { value: 'transaction_type', label: 'Type', width: [0, 1, 1, 1] },
            { value: 'project_id', label: 'Project ID', width: 2 },
            { value: 'quantity', label: 'Quantity', width: 1 },
          ]}
        />
        {data && (
          <FadeIn as='tbody'>
            {data.map((d) => (
              <Event key={d.transaction_serial_number} event={d} />
            ))}
            {data.length === 0 ? (
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
                { value: 'transaction_date', width: [2, 1, 1, 1] },
                { value: 'transaction_type', width: [0, 1, 1, 1] },
                { value: 'project_id', width: [2, 1, 1, 1] },
                { value: 'quantity', width: 3 },
              ]}
            />
          </FadeIn>
        )}
      </Box>
    </>
  )
}

export default Events
