import {
  Chart,
  Grid,
  Plot,
  Ticks,
  TickLabels,
  Scatter,
} from '@carbonplan/charts'
import { Box, Flex } from 'theme-ui'
import useSWR from 'swr'

import Brush from './brush'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'
import { useMemo } from 'react'
import { COLORS } from '../constants'
import { alpha } from '@theme-ui/color'

const CATEGORY_ORDER = Object.keys(COLORS)

const fetcher = ([
  url,
  registry = {},
  category = {},
  complianceOnly,
  search,
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

  if (complianceOnly) {
    params.append('is_arb', complianceOnly)
  }
  if (registrationBounds) {
    params.append('registered_at_from', `${registrationBounds[0]}-01-01`)
    params.append('registered_at_to', `${registrationBounds[1]}-12-31`)
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const mungeData = (data, key, opacity = 1) => {
  if (!data) {
    return []
  } else {
    console.log(CATEGORY_ORDER)
    const categoryData = data.reduce(
      (accum, { start, end, category, value }) => {
        if (start != null && end != null) {
          const year = new Date(`${start}T00:00:00`).getFullYear()
          const datum = [year, 9 - CATEGORY_ORDER.indexOf(category)]
          if (accum[category]) {
            accum[category].push(datum)
          } else {
            accum[category] = [datum]
          }
        }
        return accum
      },
      {}
    )

    return Object.keys(categoryData).reduce((accum, category) => {
      accum.push({
        key: `${category}-${key}`,
        color:
          opacity < 1 ? alpha(COLORS[category], opacity) : COLORS[category],
        data: categoryData[category].sort(),
      })
      return accum
    }, [])
  }
}

const ProjectRegistration = () => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    registrationBounds,
    setRegistrationBounds,
  } = useQueries()
  const { data, error, isLoading } = useSWR(
    [`${process.env.NEXT_PUBLIC_API_URL}/charts/projects_by_registration_date`],
    fetcher,
    { revalidateOnFocus: false }
  )
  const {
    data: filteredData,
    error: filteredError,
    isLoading: filteredLoading,
  } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/charts/projects_by_registration_date`,
      useDebounce(registry),
      useDebounce(category),
      complianceOnly,
      useDebounce(search),
      useDebounce(registrationBounds),
    ],
    fetcher,
    { revalidateOnFocus: false }
  )

  const lines = useMemo(() => {
    return [
      ...mungeData(data, 'all', 0.5),
      ...mungeData(filteredData, 'filtered', 1),
    ]
  }, [data, filteredData])

  return (
    <>
      <Flex sx={{ gap: 3 }}>
        Project registration
        <Box sx={{ fontSize: 0, mt: 1, color: 'secondary' }}>
          {registrationBounds
            ? registrationBounds.join(' - ')
            : 'Drag to filter'}
        </Box>
      </Flex>
      <Box sx={{ height: '200px', mt: 3 }}>
        <Chart x={[2000, 2023]} y={[0, 9]} padding={{ left: 0 }}>
          <Ticks bottom />
          <TickLabels bottom />
          <Grid vertical />
          <Plot>
            <Brush setBounds={setRegistrationBounds} />
            {lines.map(({ color, data, key }) => (
              <Scatter key={key} color={color} data={data} />
            ))}
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default ProjectRegistration
