import { Column, Row } from '@carbonplan/components'

const TableRow = ({ values, as, sx, Button, ...props }) => {
  const starts = values.reduce((accum, v, i) => {
    if (accum.length === 0) {
      accum.push([1, 1, 1, 1])
    } else {
      let prevWidth = values[i - 1].width
      if (typeof prevWidth === 'number') {
        prevWidth = [prevWidth, prevWidth, prevWidth, prevWidth]
      } else if (!prevWidth) {
        prevWidth = [1, 1, 1, 1]
      }

      accum.push(accum[accum.length - 1].map((d, i) => d + prevWidth[i]))
    }
    return accum
  }, [])

  return (
    <Row as='tr' columns={[6, 8, 8, 8]} sx={sx} {...props}>
      {values.map((value, i) => (
        <Column
          as={value?.as ?? as ?? 'td'}
          key={value?.key ?? value?.label ?? value}
          start={value.start ?? starts[i]}
          width={value?.width ?? 1}
          sx={{
            fontSize: 1,
            textAlign: 'left',
            color: 'secondary',
            fontFamily: 'mono',
            letterSpacing: 'mono',
            mb: 4,
            mt: 2,
            display: value?.width?.map
              ? value.width.map((w) => (w === 0 ? 'none' : 'inherit'))
              : 'inherit',
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
