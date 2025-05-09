import { Filter } from '@carbonplan/components'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useQueries } from './queries'
import { Box } from 'theme-ui'
import { ListSelection } from './list-filter'

// From https://stackoverflow.com/questions/35166758/react-javascript-displaying-decoding-unicode-characters
function convertUnicode(input) {
  return input.replace(/\\+u([0-9a-fA-F]{4})/g, (a, b) =>
    String.fromCharCode(parseInt(b, 16))
  )
}

const fetcher = (path) => {
  const params = new URLSearchParams()
  params.append('path', path)

  const reqUrl = new URL(
    '/research/offsets-db/api/query',
    window.location.origin
  )
  reqUrl.search = params.toString()

  return fetch(reqUrl)
    .then((r) => r.json())
    .then(({ Top, Other }) => ({ Top, Other: Other.map(convertUnicode) }))
}

const SHORT_LABELS = {
  'Improved Forest Management': 'IFM',
}

const ProjectType = () => {
  const { projectType, setProjectType } = useQueries()
  const { data: projectTypes } = useSWR('projects/types', fetcher, {
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
          if (
            All &&
            prev &&
            prev.length !== projectTypes.Top.length + projectTypes.Other.length
          ) {
            // Handle selecting All:
            // - Clear filters by setting projectType to null
            // - Ensure Other-filtering is hidden
            setSelectOthers(false)
            return null
          } else if (!All && !prev) {
            // Handle deselecting All (specifically checking for projectType = null to accommodate double-clicks):
            // - Clear all selections
            return []
          } else {
            // Otherwise, inspect selections.
            const topValues = Object.keys(values).filter((key) => values[key])
            let otherValues = []
            if (Other) {
              otherValues = projectTypes.Other
            } else if (updatedSelectOthers) {
              otherValues = prev.filter((type) =>
                projectTypes.Other.includes(type)
              )
            }

            const array = [...topValues, ...otherValues]

            // Return null if all types are manually selected.
            return array.length ===
              projectTypes.Top.length + projectTypes.Other.length
              ? null
              : array
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
