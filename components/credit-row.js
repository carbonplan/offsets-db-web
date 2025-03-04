import { formatDate } from '@carbonplan/components'
import { Box, Flex, Text } from 'theme-ui'

import Quantity from './quantity'
import { TableRow } from './table'
import ProjectBadge from './project-badge'

const CreditRow = ({ color, event, projectView, ...props }) => {
  const {
    projects,
    transaction_date,
    transaction_type,
    quantity,
    vintage,
    retirement_account,
    retirement_beneficiary,
    retirement_note,
    retirement_reason,
  } = event

  return (
    <>
      <TableRow
        columns={projectView ? [6, 6, 7, 7] : [6, 8, 8, 8]}
        values={[
          ...(projectView
            ? []
            : [
                {
                  label: <ProjectBadge project={projects[0]} link />,
                  key: 'project_id',
                  width: [2, 1, 1, 1],
                },
              ]),

          {
            key: 'transaction_date',
            label: transaction_date ? (
              <Text sx={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {formatDate(transaction_date, {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  separator: '-',
                })}
              </Text>
            ) : (
              '?'
            ),
            width: [1, 1, 1, 1],
          },
          {
            key: 'transaction_type',
            label: (
              <Text sx={{ textTransform: 'capitalize' }}>
                {transaction_type}
              </Text>
            ),
            width: [0, 1, 1, 1],
          },
          {
            key: 'quantity',
            label: (
              <Flex sx={{ gap: 2 }}>
                <Quantity color={color} value={quantity} />
                <Box sx={{ display: ['inherit', 'none', 'none', 'none'] }}>
                  {transaction_type === 'retirement' ? 'retired' : 'issued'}
                </Box>
              </Flex>
            ),
            width: [2, 1, 1, 1],
          },
          {
            key: 'vintage',
            label: vintage ?? '?',
            width: [projectView ? 1 : 0, 1, 1, 1],
          },
          {
            key: 'beneficiary',
            label: (
              <Text>
                {retirement_account ??
                  retirement_beneficiary ??
                  retirement_note ??
                  retirement_reason ?? (
                    <Text sx={{ opacity: 0.5 }}>
                      {transaction_type === 'issuance' ? 'N/A' : 'None listed'}
                    </Text>
                  )}
              </Text>
            ),
            width: 3,
          },
        ]}
        {...props}
      />
    </>
  )
}

export default CreditRow
