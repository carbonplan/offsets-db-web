import { Chart, Grid, Plot, Ticks, TickLabels } from '@carbonplan/charts'
import { Box, Flex, useThemeUI } from 'theme-ui'
import useSWR from 'swr'
import { alpha } from '@theme-ui/color'
import { useMemo } from 'react'

import Brush from './brush'
import Heatmap, { mungeData } from './heatmap'
import { useQueries } from '../queries'
import { useDebounce } from '../utils'

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

  const points = useMemo(() => {
    const max = data
      ? Math.max(
          ...data
            .filter((d) => d.start != null && d.end != null)
            .map((d) => d.value)
        )
      : 0

    const background = !!registrationBounds
      ? alpha('muted', 0.5)(theme)
      : theme.rawColors.muted
    return [
      ...Array(24)
        .fill(null)
        .map((a, i) =>
          Array(9)
            .fill(null)
            .map((d, j) => ({
              color: background,
              value: [2000 + i, j],
              key: 'background',
            }))
        )
        .flat(),
      ...mungeData(data, theme, max, 'all', background, 'secondary'),
      ...mungeData(filteredData, theme, max, 'filtered', background, null),
    ]
  }, [data, filteredData, theme, !!registrationBounds])

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
        <Chart x={[2000, 2023]} y={[-0.5, 8.45]} padding={{ left: 0 }}>
          <Ticks bottom />
          <TickLabels bottom />
          <Grid vertical />
          <Plot>
            <Brush setBounds={setRegistrationBounds} />
            <Heatmap data={points} />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default ProjectRegistration
