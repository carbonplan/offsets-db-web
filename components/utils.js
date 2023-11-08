import { format } from 'd3-format'
import { useEffect, useState } from 'react'

export const formatValue = (value) => {
  if (value < 1000) {
    return value
  } else {
    let result = format('.3s')(value)
    if (value >= 1e9) {
      return result.replace('G', 'B')
    }
    return result
  }
}

export const projectSorters = {
  default: (sort) => (a, b) => a[sort]?.localeCompare(b[sort]),
  retired: (sort) => (a, b) => a[sort] - b[sort],
  issued: (sort) => (a, b) => a[sort] - b[sort],
  project_id: (a, b) => {
    const values = [a.project_id, b.project_id]
    const prefixes = values.map((d) => d.match(/\D+/)[0])
    const numbers = values.map((d) => d.match(/\d+/)[0])

    if (prefixes[0] !== prefixes[1]) {
      return prefixes[0].localeCompare(prefixes[1])
    } else {
      return Number(numbers[0]) - Number(numbers[1])
    }
  },
}

export const useDebounce = (value, delay = 100) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [value])

  return debounced
}
