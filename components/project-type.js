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
      accum[key] = projectType ? projectType.includes(key) : true
      return accum
    }, {})

    return {
      All: projectType
        ? projectType.length ===
          projectTypes.Top.length + projectTypes.Other.length
        : true,
      ...topTypes,
      Other: projectType
        ? projectTypes.Other.every((type) => projectType.includes(type))
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
      setProjectType((prev) => {
        // If selecting all after having previously filtered, clear filters
        if (
          All &&
          prev &&
          prev.length !== projectTypes.Top.length + projectTypes.Other.length
        ) {
          return null
        } else {
          return [
            ...Object.keys(values).filter((key) => values[key]),
            ...(Other ? projectTypes.Other : []),
          ]
        }
      })
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
