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
          {countries.length > 0 && (
            <Flex sx={{ flexWrap: 'wrap', gap: 2, mt: 3 }}>
              {countries.map((c) => (
                <Badge sx={{ color: 'primary' }} key={c}>
                  <Button
                    sx={{ fontFamily: 'mono', fontSize: 1, mt: 1 }}
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
            {filtered.map((c) => (
              <Button
                inverted
                key={c}
                size='xs'
                sx={{ fontFamily: 'mono', fontSize: 1 }}
                onClick={() => addCountry(c)}
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
    </>
  )
}

export default Countries
