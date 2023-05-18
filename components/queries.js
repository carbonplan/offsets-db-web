import { Column, Filter, Input, Row } from '@carbonplan/components'
import { createContext, useContext, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { COLORS, LABELS } from './constants'

const QueryContext = createContext({
  registry: {},
  setRegistry: () => {},
})

export const QueryProvider = ({ children }) => {
  const [registry, setRegistry] = useState({
    verra: true,
    'gold-standard': true,
    'global-carbon-council': true,
    'american-carbon-registry': true,
    'climate-action-reserve': true,
    'art-trees': true,
  })
  const [category, setCategory] = useState({
    'mine-methane': true,
    soil: true,
    agriculture: true,
    forest: true,
    landfill: true,
    'industrial-gases': true,
    renewable: true,
    transportation: true,
    other: true,
  })
  const [search, setSearch] = useState('')
  const [registrationBounds, setRegistrationBounds] = useState(null)

  return (
    <QueryContext.Provider
      value={{
        registry,
        setRegistry,
        category,
        setCategory,
        search,
        setSearch,
        registrationBounds,
        setRegistrationBounds,
      }}
    >
      {children}
    </QueryContext.Provider>
  )
}
export const useQueries = () => {
  return useContext(QueryContext)
}

const sx = {
  label: {
    color: 'secondary',
    textTransform: 'uppercase',
    fontFamily: 'mono',
    letterSpacing: 'mono',
    fontSize: 1,
  },
}

const Queries = () => {
  const { registry, setRegistry, category, setCategory, search, setSearch } =
    useQueries()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 5, mt: 5 }}>
      <Row columns={[3]}>
        <Column start={1} width={1}>
          <Box sx={sx.label}>Search</Box>
        </Column>
        <Column start={[2]} width={[2]}>
          <Input
            placeholder='Enter search term'
            size='xs'
            sx={{ width: '100%', borderBottom: 0 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Column>
      </Row>
      <Row columns={[3]}>
        <Column start={1} width={1}>
          <Box sx={sx.label}>Registry</Box>
        </Column>
        <Column start={[2]} width={[2]}>
          <Filter
            values={registry}
            setValues={setRegistry}
            labels={LABELS.registry}
            showAll
            multiSelect
          />
        </Column>
      </Row>
      <Row columns={[3]}>
        <Column start={1} width={1}>
          <Box sx={sx.label}>Category</Box>
        </Column>
        <Column start={[2]} width={[2]}>
          <Filter
            values={category}
            setValues={setCategory}
            labels={LABELS.category}
            colors={COLORS.category}
            showAll
            multiSelect
          />
        </Column>
      </Row>
    </Flex>
  )
}

export default Queries
