import { Filter } from '@carbonplan/components'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useQueries } from './queries'
import { Box } from 'theme-ui'
import { ListSelection } from './list-filter'

const fetcher = (path) => {
  const params = new URLSearchParams()
  params.append('path', path)

  const reqUrl = new URL(
    '/research/offsets-db/api/query',
    window.location.origin
  )
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const SHORT_LABELS = {
  'Improved Forest Management': 'IFM',
}

const ProjectType = () => {
  const { projectType, setProjectType } = useQueries()
  const {
    data: projectTypes,
    error,
    isFetching,
  } = useSWR('projects/types', fetcher, {
    revalidateOnFocus: false,
  })
  const [selectOthers, setSelectOthers] = useState(false)

  const values = useMemo(() => {
    if (!projectTypes) {
      return {}
    }
    const topTypes = projectTypes.Top.reduce((accum, key) => {
      // if projectType is not defined, select all projectTypes
      accum[key] = projectType ? projectType[key] : true
      return accum
    }, {})

    return {
      All: projectType
        ? projectTypes.Top.every((type) => projectType[type]) &&
          projectTypes.Other.every((type) => projectType[type])
        : true,
      ...topTypes,
      Other: projectType
        ? projectTypes.Other.some((type) => projectType[type])
        : true,
      'Select other types': selectOthers,
    }
  }, [projectTypes, projectType, selectOthers])

  const labels = useMemo(() => {
    return Object.keys(values).reduce((a, key) => {
      a[key] = SHORT_LABELS[key] ?? key
      return a
    }, {})
  }, [values])

  const setValues = useCallback(
    ({ All, Other, 'Select other types': selectOthersValue, ...values }) => {
      setSelectOthers(selectOthersValue)
      setProjectType((prev) =>
        All && prev && Object.keys(prev).some((k) => !prev[k])
          ? null
          : {
              ...values,
              ...(Other && projectTypes
                ? projectTypes.Other.reduce((accum, key) => {
                    accum[key] = true
                    return accum
                  }, {})
                : {}),
            }
      )
    },
    [projectTypes, setProjectType]
  )

  return !projectTypes ? (
    'Loading...'
  ) : (
    <Box>
      <Filter
        values={values}
        setValues={setValues}
        labels={labels}
        multiSelect
      />
      {selectOthers && (
        <ListSelection
          items={projectTypes.Other}
          selectedItems={[]}
          setSelection={() => setSelectOthers(false)}
          placeholder={'enter type'}
          setter={() => {}}
        />
      )}
    </Box>
  )
}

export default ProjectType
