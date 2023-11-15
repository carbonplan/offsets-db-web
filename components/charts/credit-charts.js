import { useCallback, useState } from 'react'
import { Column, Row } from '@carbonplan/components'

import CreditTransactions from './credit-transactions'

const CreditCharts = ({ color, project_id }) => {
  const [domain, setDomain] = useState(null)

  const handleDomain = useCallback((value) => {
    setDomain((prev) => {
      if (!prev) {
        return value
      } else if (prev[0] === value[0] && prev[1] === value[1]) {
        return prev
      } else {
        return [Math.min(value[0], prev[0]), Math.max(value[1], prev[1])]
      }
    })
  }, [])

  return (
    <Row
      columns={[6, 8, 8, 8]}
      sx={{
        color: 'primary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        textTransform: 'uppercase',
      }}
    >
      <Column start={1} width={[6, 4, 4, 4]}>
        <CreditTransactions
          transactionType='issuance'
          project_id={project_id}
          color={color}
          domain={domain}
          setDomain={handleDomain}
        />
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
        <CreditTransactions
          transactionType='retirement'
          project_id={project_id}
          color={color}
          domain={domain}
          setDomain={handleDomain}
        />
      </Column>
    </Row>
  )
}

export default CreditCharts
