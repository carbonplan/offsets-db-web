import { Column, Filter, Input, Row, Toggle } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { COLORS, LABELS } from './constants'
import Countries from './countries'

const QueryContext = createContext({
  registry: {},
  setRegistry: () => {},
})

export const QueryProvider = ({ children }) => {
  const router = useRouter()
  const [registry, setRegistry] = useState({
    verra: true,
    'gold-standard': true,
    'global-carbon-council': true,
    'american-carbon-registry': true,
    'climate-action-reserve': true,
    'art-trees': true,
  })
  const [category, setCategory] = useState({
    agriculture: true,
    forest: true,
    'industrial-gases': true,
    landfill: true,
    'mine-methane': true,
    renewable: true,
    soil: true,
    transportation: true,
    other: true,
  })
  const [complianceOnly, setComplianceOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [registrationBounds, setRegistrationBounds] = useState(null)
  const [issuedBounds, setIssuedBounds] = useState(null)
  const [transactionBounds, setTransactionBounds] = useState(null)
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    if (router.query.project_id) {
      setSearch(router.query.project_id)
      router.replace({ pathname: router.pathname, query: {} })
    }
  }, [router.query.project_id])

  return (
    <QueryContext.Provider
      value={{
        registry,
        setRegistry,
        category,
        setCategory,
        complianceOnly,
        setComplianceOnly,
        search,
        setSearch,
        registrationBounds,
        setRegistrationBounds,
        issuedBounds,
        setIssuedBounds,
        transactionBounds,
        setTransactionBounds,
        countries,
        setCountries,
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
    mb: [2, 0, 0, 0],
  },
}

const Queries = () => {
  const {
    registry,
    setRegistry,
    category,
    setCategory,
    complianceOnly,
    setComplianceOnly,
    search,
    setSearch,
  } = useQueries()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 5, mt: 5 }}>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Search</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <Input
            placeholder='Enter search term'
            size='xs'
            sx={{ width: '100%', borderBottom: 0 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Registry</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <Filter
            values={registry}
            setValues={setRegistry}
            labels={LABELS.registry}
            showAll
            multiSelect
          />
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Category</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <Filter
            values={category}
            setValues={setCategory}
            labels={LABELS.category}
            colors={COLORS}
            showAll
            multiSelect
          />
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Country</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <Countries />
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Compliance</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <Toggle
            value={complianceOnly}
            onClick={() => setComplianceOnly((prev) => !prev)}
          />
        </Column>
      </Row>
    </Flex>
  )
}

export default Queries
