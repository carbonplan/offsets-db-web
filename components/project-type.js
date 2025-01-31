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
    ({ All, Other, 'Select other types': updatedSelectOthers, ...values }) => {
      if (!selectOthers && updatedSelectOthers) {
        setSelectOthers(true)
        setProjectType([])
      } else {
        setSelectOthers(Other ? false : updatedSelectOthers)
        setProjectType((prev) => {
          // If selecting all after having previously filtered, clear filters
          if (
            All &&
            prev &&
            prev.length !== projectTypes.Top.length + projectTypes.Other.length
          ) {
            setSelectOthers(false)
            return null
          } else {
            const topValues = Object.keys(values).filter((key) => values[key])
            let otherValues = []
            if (Other) {
              otherValues = projectTypes.Other
            } else if (updatedSelectOthers) {
              otherValues = prev.filter((type) =>
                projectTypes.Other.includes(type)
              )
            }
            return [...topValues, ...otherValues]
          }
        })
      }
    },
    [projectTypes, setProjectType, selectOthers]
  )

  const selectedOthers = useMemo(() => {
    if (!projectType || !projectTypes) {
      return []
    } else {
      const alreadySelected = projectType.filter((type) =>
        projectTypes.Other.includes(type)
      )
      if (alreadySelected.length === projectTypes.Other.length) {
        return []
      } else {
        return alreadySelected
      }
    }
  }, [projectType, projectTypes])

  const handleSetOthers = useCallback(
    (otherValues) => {
      setProjectType((prev) => [
        ...prev.filter((type) => projectTypes.Top.includes(type)),
        ...otherValues,
      ])
    },
    [setProjectType, projectTypes]
  )

  return !projectTypes ? (
    <Filter values={{ All: true, 'Loading...': false }} setValues={() => {}} />
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
          selectedItems={selectedOthers}
          setSelection={() => setSelectOthers(false)}
          placeholder={'enter type'}
          setter={handleSetOthers}
        />
      )}
    </Box>
  )
}

export default ProjectType
