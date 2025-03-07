import { Badge, Link } from '@carbonplan/components'

import { COLORS } from './constants'

const ProjectBadge = ({ project, link }) => {
  const { project_id, category } = project
  const color = COLORS[category[0]] ?? COLORS.other

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
