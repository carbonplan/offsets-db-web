import { Column, Row } from '@carbonplan/components'

const TableRow = ({ values, as, sx, Button }) => {
  const starts = values.reduce((accum, v, i) => {
    if (accum.length === 0) {
      accum.push(1)
    } else {
      const prevWidth = values[i - 1].width ?? 1
      accum.push(accum[accum.length - 1] + prevWidth)
    }
    return accum
  }, [])

  return (
    <Row as='tr' columns={[6, 8, 8, 8]}>
      {values.map((value, i) => (
        <Column
          as={value?.as ?? as ?? 'td'}
          key={value?.label ?? value}
          start={starts[i]}
          width={value?.width ?? 1}
          sx={{
            fontSize: 1,
            textAlign: 'left',
            color: 'secondary',
            fontFamily: 'mono',
            letterSpacing: 'mono',
            mb: 4,
            mt: 2,
            ...sx,
          }}
        >
          {Button && <Button value={value} />}
          {value?.label ?? value}
        </Column>
      ))}
    </Row>
  )
}

export default TableRow
