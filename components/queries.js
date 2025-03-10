import { Column, Filter, Input, Row } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import Category from './category'
import { ALL_CATEGORIES, COUNTRIES, PROTOCOLS, LABELS } from './constants'
import ListFilter from './list-filter'
import TooltipWrapper from './tooltip-wrapper'

const QueryContext = createContext({
  registry: {},
  setRegistry: () => {},
})

export const QueryProvider = ({ children }) => {
  const router = useRouter()
  const [registry, setRegistry] = useState({
    'american-carbon-registry': true,
    'art-trees': true,
    'climate-action-reserve': true,
    'gold-standard': true,
    verra: true,
  })
  const [category, setCategory] = useState(() =>
    ALL_CATEGORIES.reduce((a, k) => {
      a[k] = true
      return a
    }, {})
  )
  const [complianceOnly, setComplianceOnly] = useState(null)
  const [search, setSearch] = useState('')
  const [listingBounds, setlistingBounds] = useState(null)
  const [issuedBounds, setIssuedBounds] = useState(null)
  const [transactionBounds, setTransactionBounds] = useState(null)
  const [countries, setCountries] = useState([])
  const [protocols, setProtocols] = useState([])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('-issued')

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
        listingBounds,
        setlistingBounds,
        issuedBounds,
        setIssuedBounds,
        transactionBounds,
        setTransactionBounds,
        countries,
        setCountries,
        protocols,
        setProtocols,
        page,
        setPage,
        sort,
        setSort,
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
    complianceOnly,
    setComplianceOnly,
    search,
    setSearch,
    countries,
    setCountries,
    protocols,
    setProtocols,
  } = useQueries()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 5, mt: 5 }}>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Search</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <TooltipWrapper tooltip='Search projects by ID or name.'>
            <Input
              placeholder='enter search term'
              size='xs'
              sx={{
                fontSize: 1,
                fontFamily: 'mono',
                width: '100%',
                borderBottom: 0,
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Registry</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <TooltipWrapper tooltip='Filter projects by registry.'>
            <Filter
              values={registry}
              setValues={setRegistry}
              labels={LABELS.registry}
              showAll
              multiSelect
            />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Category</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <TooltipWrapper tooltip='Filter projects by category.'>
            <Category />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Country</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <TooltipWrapper tooltip='Filter projects by country.'>
            <ListFilter
              items={COUNTRIES}
              selectedItems={countries}
              title={'select countries'}
              placeholder={'enter country'}
              setter={setCountries}
            />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Protocol</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <TooltipWrapper tooltip='Filter projects by protocol.'>
            <ListFilter
              items={PROTOCOLS}
              selectedItems={protocols}
              title={'select protocols'}
              placeholder={'enter protocol'}
              setter={setProtocols}
            />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[2, 2, 1, 1]}>
          <Box sx={sx.label}>Program</Box>
        </Column>
        <Column start={[1, 3, 2, 2]} width={[6, 5, 2, 2]}>
          <TooltipWrapper tooltip='Filter projects by market.'>
            <Filter
              values={{
                all: typeof complianceOnly !== 'boolean',
                compliance:
                  complianceOnly || typeof complianceOnly !== 'boolean',
                voluntary: !complianceOnly,
              }}
              setValues={(obj) => {
                let value
                if (obj.compliance && obj.voluntary) {
                  value = null
                } else if (obj.compliance) {
                  value = true
                } else if (obj.voluntary) {
                  value = false
                } else {
                  return
                }
                setComplianceOnly(value)
              }}
              multiSelect
            />
          </TooltipWrapper>
        </Column>
      </Row>
    </Flex>
  )
}

export default Queries
