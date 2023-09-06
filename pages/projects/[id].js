import Project from '../../components/project'

const ProjectPage = ({ project }) => {
  return <Project project={project} />
}

export default ProjectPage

export async function getServerSideProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}`
  )
  const project = await res.json()

  return {
    props: { project },
  }
}
