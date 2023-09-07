import { Column, Row } from '@carbonplan/components'

import CreditTransactions from './credit-transactions'

const CreditCharts = ({ project_id, setTransactionType }) => {
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
          setTransactionType={setTransactionType}
        />
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
        <CreditTransactions
          transactionType='retirement'
          project_id={project_id}
          setTransactionType={setTransactionType}
        />
      </Column>
    </Row>
  )
}

export default CreditCharts
