import {
  Chart,
  Grid,
  Plot,
  Ticks,
  TickLabels,
  useChart,
} from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { mix } from 'polished'

import Brush from './brush'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'
import { useMemo } from 'react'
import { COLORS } from '../constants'

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

const mungeData = (data, theme, max, key, mixer) => {
  if (!data) {
    return []
  } else {
    return data
      .map(({ start, end, category, value }) => {
        if (start != null && end != null) {
          const year = new Date(`${start}T00:00:00`).getFullYear()
          const datum = [year, 9 - CATEGORY_ORDER.indexOf(category)]
          const color = mixer
            ? mix(
                0.25,
                theme.rawColors[COLORS[category]],
                theme.rawColors[mixer]
              )
            : theme.rawColors[COLORS[category]]
          return {
            key,
            value: datum,
            color: mix(value / max, color, theme.rawColors.background),
          }
        } else {
          return null
        }
      }, {})
      .filter(Boolean)
  }
}

const Heatmap = ({ data, size = 10 }) => {
  const { x, y } = useChart()

  return (
    <>
      {data.map(({ key, value, color }) => (
        <Box
          key={`${key}-${value.join(',')}`}
          as='path'
          d={`M${x(value[0])} ${y(value[1])} A0 0 0 0 1 ${
            x(value[0]) + 0.0001
          } ${y(value[1]) + 0.0001}`}
          sx={{
            stroke: color,
            strokeWidth: size,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none',
            vectorEffect: 'non-scaling-stroke',
          }}
        />
      ))}
    </>
  )
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
  const { theme } = useThemeUI()
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
      ...mungeData(data, theme, 3, 'all', 'secondary'),
      ...mungeData(filteredData, theme, 3, 'filtered', null),
    ]
  }, [data, filteredData, theme])

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
            <Heatmap data={lines} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default ProjectRegistration
