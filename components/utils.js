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
    return result.toUpperCase(0)
  }
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

export const getProjectCategory = (project) => {
  return Array.isArray(project.category)
    ? project.category[0]
    : project.category
}
