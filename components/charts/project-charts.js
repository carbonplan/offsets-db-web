import { Column, Row } from '@carbonplan/components'

import ProjectRegistration from './project-registration'

const ProjectCharts = () => {
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
        <ProjectRegistration />
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}></Column>
    </Row>
  )
}

export default ProjectCharts
