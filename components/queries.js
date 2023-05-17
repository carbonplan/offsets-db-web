import { Column, Filter, Input, Row } from '@carbonplan/components'
import { createContext, useContext, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { LABELS } from './constants'

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
  const [search, setSearch] = useState('')
  const [registrationBounds, setRegistrationBounds] = useState(null)

  return (
    <QueryContext.Provider
      value={{
        registry,
        setRegistry,
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
  const { registry, setRegistry, search, setSearch } = useQueries()

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
    </Flex>
  )
}

export default Queries
