import { Column, Row } from '@carbonplan/components'
import { Divider } from 'theme-ui'

const Layout = ({ sidebar, children }) => {
  return (
    <Row>
      {sidebar}
      <Column start={[1, 1, 5, 5]} width={[6, 8, 8, 8]}>
        <Divider
          sx={{
            display: ['inherit', 'inherit', 'none', 'none'],
            ml: [-4, -5, -5, -6],
            mr: [-4, -5, 0, 0],
            mt: 3,
            mb: 2,
          }}
        />
        {children}
      </Column>
    </Row>
  )
}

export default Layout
