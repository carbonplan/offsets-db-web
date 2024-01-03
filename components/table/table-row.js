import { Column, Row } from '@carbonplan/components'
import { Flex } from 'theme-ui'

const TableRow = ({
  values,
  as,
  sx,
  Button,
  columns = [6, 8, 8, 8],
  ...props
}) => {
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
    <Row as='tr' columns={columns} sx={sx} {...props}>
      {values.map((value, i) => (
        <Column
          as={value?.as ?? as ?? 'td'}
          key={value?.key ?? value?.label ?? value}
          start={value.start ?? starts[i]}
          width={value?.width ?? 1}
          sx={{
            fontSize: 1,
            textAlign: 'left',
            alignSelf: 'center',
            color: 'secondary',
            fontFamily: 'body',
            mb: 3,
            mt: 3,
            display: value?.width?.map
              ? value.width.map((w) => (w === 0 ? 'none' : 'inherit'))
              : 'inherit',
            alignItems: 'center',
          }}
        >
          <Flex sx={{ flexDirection: 'column', height: '100%' }}>
            {Button && <Button value={value} />}
            {value?.label ?? value}
          </Flex>
        </Column>
      ))}
    </Row>
  )
}

export default TableRow
