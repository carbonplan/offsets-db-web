import { Badge, Button, Filter, Input } from '@carbonplan/components'
import { X } from '@carbonplan/icons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Flex, IconButton } from 'theme-ui'

export const ListSelection = ({
  items,
  selectedItems,
  setSelection,
  placeholder,
  setter,
}) => {
  const [query, setQuery] = useState('')
  const ref = useRef()

  const { filtered, hidden } = useMemo(() => {
    let hidden = 0
    if (!query) {
      return { filtered: [], hidden }
    }

    let filtered = items.filter(
      (item) =>
        !selectedItems?.includes(item) &&
        item.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    )

    if (filtered.length > 5) {
      hidden = filtered.length - 5
      filtered = filtered.slice(0, 5)
    }

    return { filtered, hidden }
  }, [selectedItems, query])

  const addItem = useCallback(
    (item) => {
      setFocusedIndex(-1)
      setQuery('')
      setter([...selectedItems, item].sort())
    },
    [selectedItems, setter]
  )

  const removeItem = useCallback(
    (item) => {
      setter(selectedItems.filter((i) => item !== i))
    },
    [selectedItems]
  )

  useEffect(() => {
    ref.current.focus()
  }, [])

  // handle keyboard navigation of filtered countries
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const filteredItemsRefs = useRef([])

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
    if (focusedIndex >= 0 && filteredItemsRefs.current[focusedIndex]) {
      filteredItemsRefs.current[focusedIndex].focus()
    }
  }, [focusedIndex])

  useEffect(() => {
    setFocusedIndex(-1)
  }, [query])

  return (
    <Box onKeyDown={handleKeyDown}>
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
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton
          onClick={() => {
            setSelection(false)
            setter([])
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
      {selectedItems.length > 0 && (
        <Flex sx={{ flexWrap: 'wrap', gap: 1, mt: 3 }}>
          {selectedItems.map((item) => (
            <Badge
              sx={{
                color: 'primary',
                height: 'fit-content',
              }}
              key={item}
            >
              <Button
                sx={{
                  fontFamily: 'mono',
                  fontSize: 1,
                  py: '3px',
                }}
                suffix={<X sx={{ height: 10, width: 10 }} />}
                onClick={() => removeItem(item)}
              >
                {item}
              </Button>
            </Badge>
          ))}
        </Flex>
      )}
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 2,
          mt: selectedItems.length > 0 ? 2 : 3,
          maxHeight: '300px',
          overflowY: 'auto',
          pr: [4, 5, 5, 6],
          mr: [-4, -5, -5, -6],
        }}
      >
        {filtered.map((item, i) => (
          <Button
            inverted
            key={item}
            size='xs'
            sx={{
              fontFamily: 'mono',
              fontSize: 1,
              '&:focus': {
                color: 'primary',
                backgroundColor: 'transparent !important',
                outline: 'none !important',
              },
            }}
            onClick={() => addItem(item)}
            ref={(el) => (filteredItemsRefs.current[i] = el)}
            onKeyDown={(e) => e.key === 'Enter' && addItem(item)}
          >
            {item}
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
    </Box>
  )
}

const ListFilter = ({ items, selectedItems, title, placeholder, setter }) => {
  const [selection, setSelection] = useState(selectedItems.length > 0)

  return (
    <Box>
      <Filter
        values={{
          All: !selection,
          [title]: selection,
        }}
        setValues={(obj) => {
          if (obj['All']) {
            setSelection(false)
            setter([])
          } else {
            setSelection(true)
            setter([])
          }
        }}
      />
      {selection && (
        <ListSelection
          items={items}
          selectedItems={selectedItems}
          setSelection={setSelection}
          placeholder={placeholder}
          setter={setter}
        />
      )}
    </Box>
  )
}

export default ListFilter
