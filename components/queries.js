import { Column, Filter, Row } from '@carbonplan/components'
import { createContext, useContext, useState } from 'react'
import { Box } from 'theme-ui'
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

  return (
    <QueryContext.Provider value={{ registry, setRegistry }}>
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
  const { registry, setRegistry } = useQueries()

  return (
    <>
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
    </>
  )
}

export default Queries
