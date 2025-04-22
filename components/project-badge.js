import { Badge, Link } from '@carbonplan/components'

import { COLORS } from './constants'
import { getProjectCategory } from './utils'

const ProjectBadge = ({ project, link }) => {
  const { project_id } = project
  const color = COLORS[getProjectCategory(project)] ?? COLORS.other

  const inner = (
    <Badge
      sx={{
        color: color,
        userSelect: link ? 'none' : 'all',
      }}
    >
      {project_id}
    </Badge>
  )

  if (link) {
    return <Link href={`/projects/${project_id}`}>{inner}</Link>
  } else {
    return inner
  }
}

export default ProjectBadge
