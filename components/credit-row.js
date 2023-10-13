import { Badge, Button, formatDate } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { Box, Flex, Text } from 'theme-ui'
import { format } from 'd3-format'
import { TableRow } from './table'

const CreditRow = ({ event, projectView }) => {
  const { project_id, transaction_date, transaction_type, quantity, vintage } =
    event

  return (
    <>
      <TableRow
        values={[
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
            width: [2, 1, 1, 1],
          },
          {
            key: 'transaction_type',
            label: (
              <Text sx={{ textTransform: 'uppercase' }}>
                {transaction_type}
              </Text>
            ),
            width: projectView ? [0, 3, 3, 3] : [0, 1, 1, 1],
          },
          ...(projectView
            ? []
            : [
                {
                  label: (
                    <Button
                      suffix={
                        <RotatingArrow
                          sx={{ mt: '-3px', width: 13, height: 13 }}
                        />
                      }
                      href={`/projects/${project_id}`}
                      sx={{ fontSize: 2 }}
                    >
                      {project_id}
                    </Button>
                  ),
                  key: 'project_id',
                  width: 2,
                },
              ]),
          {
            key: 'quantity',
            label: (
              <Flex sx={{ gap: 3 }}>
                <Badge>
                  {quantity > 100 ? format('.3s')(quantity) : quantity}
                </Badge>
                <Box sx={{ display: ['inherit', 'none', 'none', 'none'] }}>
                  {transaction_type === 'retirement' ? 'retired' : 'issued'}
                </Box>
              </Flex>
            ),
            width: [2, 1, 1, 1],
          },
        ]}
      />
    </>
  )
}

export default CreditRow
