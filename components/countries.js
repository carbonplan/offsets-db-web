import { Badge, Button, Filter, Input } from '@carbonplan/components'
import { X } from '@carbonplan/icons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Flex, IconButton } from 'theme-ui'
import { COUNTRIES } from './constants'
import { useQueries } from './queries'

const Countries = () => {
  const [countrySelection, setCountrySelection] = useState(false)
  const [query, setQuery] = useState('')
  const { countries, setCountries } = useQueries()
  const ref = useRef()

  const { filtered, hidden } = useMemo(() => {
    let hidden = 0
    if (!query) {
      return { filtered: [], hidden }
    }

    const filtered = COUNTRIES.filter(
      (c) =>
        !countries?.includes(c) &&
        c.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    )

    if (filtered.length > 5) {
      hidden = filtered.length - 5
      filtered = filtered.slice(0, 5)
    }

    return { filtered, hidden }
  }, [countries, query])

  const addCountry = useCallback(
    (country) => {
      setFocusedIndex(-1)
      setQuery('')
      setCountries([...countries, country].sort())
    },
    [countries, setCountries]
  )
  const removeCountry = useCallback(
    (country) => {
      setCountries(countries.filter((c) => country !== c))
    },
    [countries, setCountries]
  )

  useEffect(() => {
    if (countrySelection) {
      ref.current.focus()
    }
  }, [countrySelection])

  // handle keyboard navigation of filtered countries
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const filteredCountriesRefs = useRef([])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
  }

  useEffect(() => {
    if (focusedIndex >= 0 && filteredCountriesRefs.current[focusedIndex]) {
      filteredCountriesRefs.current[focusedIndex].focus()
    }
  }, [focusedIndex])

  useEffect(() => {
    setFocusedIndex(-1)
  }, [query, countrySelection])

  return (
    <Box onKeyDown={handleKeyDown}>
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
                fontSize: 1,
                mt: 3,
                mb: 2,
                width: '100%',
              }}
              placeholder='enter country'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton
              onClick={() => {
                setCountrySelection(false)
                setCountries(null)
                setQuery('')
              }}
              sx={{
                position: 'absolute',
                right: 0,
                bottom: -1,
                width: 22,
                color: 'secondary',
                cursor: 'pointer',
                '&:hover': { color: 'primary' },
              }}
            >
              <X />
            </IconButton>
          </Box>
          {countries.length > 0 && (
            <Flex sx={{ flexWrap: 'wrap', gap: 1, mt: 3 }}>
              {countries.map((c) => (
                <Badge
                  sx={{
                    color: 'primary',
                    height: 'fit-content',
                  }}
                  key={c}
                >
                  <Button
                    sx={{
                      fontFamily: 'mono',
                      fontSize: 1,
                      py: '3px',
                    }}
                    suffix={<X sx={{ height: 10, width: 10 }} />}
                    onClick={() => removeCountry(c)}
                  >
                    {c}
                  </Button>
                </Badge>
              ))}
            </Flex>
          )}
          <Flex
            sx={{
              flexDirection: 'column',
              gap: 2,
              mt: countries.length > 0 ? 2 : 3,
              maxHeight: '300px',
              overflowY: 'scroll',
              pr: [4, 5, 5, 6],
              mr: [-4, -5, -5, -6],
            }}
          >
            {filtered.map((c, i) => (
              <Button
                inverted
                key={c}
                size='xs'
                sx={{ fontFamily: 'mono', fontSize: 1 }}
                onClick={() => addCountry(c)}
                ref={(el) => (filteredCountriesRefs.current[i] = el)}
                onKeyDown={(e) => e.key === 'Enter' && addCountry(c)}
                tabIndex={0}
              >
                {c}
              </Button>
            ))}
            {hidden > 0 && (
              <Box
                sx={{
                  fontFamily: 'mono',
                  fontSize: 1,
                  color: 'secondary',
                  mt: 2,
                }}
              >
                +{hidden} more
              </Box>
            )}
          </Flex>
        </>
      )}
    </Box>
  )
}

export default Countries
