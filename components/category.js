import { Filter } from '@carbonplan/components'
import { useQueries } from './queries'
import { COLORS, LABELS, ALL_CATEGORIES } from './constants'
import { useCallback, useMemo } from 'react'

const OTHER = ALL_CATEGORIES.filter((c) => !LABELS.category[c])

const Category = () => {
  const { category, setCategory } = useQueries()

  const values = useMemo(() => {
    return Object.keys(category).reduce(
      (accum, key) => {
        if (LABELS.category.hasOwnProperty(key)) {
          accum[key] = category[key]
        } else {
          accum['other'] ||= category[key]
        }
        return accum
      },
      Object.keys(LABELS.category).reduce((accum, key) => {
        accum[key] = false
        return accum
      }, {})
    )
  }, [category])

  const setValues = useCallback(
    ({ other, ...categories }) => {
      setCategory({
        ...categories,
        ...OTHER.reduce((accum, key) => {
          accum[key] = other
          return accum
        }, {}),
      })
    },
    [setCategory]
  )

  return (
    <Filter
      values={values}
      setValues={setValues}
      labels={LABELS.category}
      colors={COLORS}
      showAll
      multiSelect
    />
  )
}

export default Category
