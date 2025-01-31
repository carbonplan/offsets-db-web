import { Filter } from '@carbonplan/components'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useQueries } from './queries'

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
  // const [selectOthers, setSelectOthers] = useState(false)

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
      ...topTypes,
      Other: projectType
        ? projectTypes.Other.some((type) => projectType[type])
        : true,
      // 'Select others': selectOthers,
    }
  }, [projectTypes, projectType /* , selectOthers */])

  const labels = useMemo(() => {
    return Object.keys(values).reduce((a, key) => {
      a[key] = SHORT_LABELS[key] ?? key
      return a
    }, {})
  }, [values])

  const setValues = useCallback(
    ({ Other, 'Select others': selectOthersValue, ...values }) => {
      // setSelectOthers(selectOthersValue)
      setProjectType({
        ...values,
        ...(Other && projectTypes
          ? projectTypes.Other.reduce((accum, key) => {
              accum[key] = true
              return accum
            }, {})
          : {}),
      })
    },
    [projectTypes, setProjectType]
  )

  return !projectTypes ? (
    'Loading...'
  ) : (
    <Filter
      values={values}
      setValues={setValues}
      labels={labels}
      showAll
      multiSelect
    />
  )
}

export default ProjectType
