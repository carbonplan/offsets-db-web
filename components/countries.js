import { Filter, Input } from '@carbonplan/components'
import { X } from '@carbonplan/icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, IconButton } from 'theme-ui'
import { COUNTRIES } from './constants'
import { useQueries } from './queries'

const sx = {
  label: {
    color: 'secondary',
    textTransform: 'uppercase',
    fontFamily: 'mono',
    letterSpacing: 'mono',
    fontSize: 1,
    mb: [2, 0, 0, 0],
  },
}

const Countries = () => {
  const [countrySelection, setCountrySelection] = useState(false)
  const [query, setQuery] = useState('')
  const { countries, setCountries } = useQueries()
  const ref = useRef()

  const { values, order } = useMemo(() => {
    const selected =
      countries?.reduce((a, c) => {
        a[c] = true
        return a
      }, {}) ?? {}

    if (!query) {
      return { values: selected, order: countries ?? [] }
    }
    const filtered = COUNTRIES.filter(
      (c) =>
        !countries?.includes(c) &&
        c.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    )

    const order = [...(countries ?? []), ...filtered]

    const values = filtered.reduce((a, c) => {
      a[c] = false
      return a
    }, selected)

    return { order, values }
  }, [countries, query])

  useEffect(() => {
    if (countrySelection) {
      ref.current.focus()
    }
  }, [countrySelection])

  return (
    <>
      <Filter
        values={{
          All: !countrySelection,
          'Select countries': countrySelection,
        }}
        setValues={(obj) => {
          if (obj['All']) {
            setCountrySelection(false)
            setCountries(null)
          } else {
            setCountrySelection(true)
            setCountries([])
          }
        }}
      />
      {countrySelection && (
        <>
          <Box sx={{ position: 'relative' }}>
            <Input
              ref={ref}
              sx={{
                fontFamily: 'mono',
                letterSpacing: 'mono',
                fontSize: 1,
                mt: 3,
                mb: 2,
                width: '100%',
              }}
              placeholder='Enter country'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton
              onClick={() => {
                if (query) {
                  setQuery('')
                } else {
                  setCountrySelection(false)
                  setCountries(null)
                }
              }}
              sx={{
                position: 'absolute',
                right: 0,
                bottom: -1,
                width: 22,
                color: 'secondary',
                cursor: 'pointer',
              }}
            >
              <X />
            </IconButton>
          </Box>
          <Filter
            values={values}
            setValues={(obj) =>
              setCountries([...Object.keys(obj).filter((k) => obj[k])])
            }
            order={order}
            sx={{
              maxHeight: '300px',
              overflowY: 'scroll',
              pr: [4, 5, 5, 6],
              mr: [-4, -5, -5, -6],
            }}
            multiSelect
          />
        </>
      )}
    </>
  )
}

export default Countries
