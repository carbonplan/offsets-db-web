import { Layout } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Container } from 'theme-ui'

import Project from '../../components/project'

const ProjectPage = ({ project }) => {
  const router = useRouter()

  useEffect(() => {
    if (!project?.project_id) {
      router.push('/404')
    }
  }, [project?.project_id])

  if (!project?.project_id) {
    return null
  }
  return (
    <Layout
      title='Offsets DB – CarbonPlan'
      description='TK'
      card='TK'
      dimmer='top'
      footer={false}
      metadata={false}
      container={false}
      nav={'research'}
      url={'https://carbonplan.org/research/offsets-db'}
    >
      <Container>
        <Project project={project} />
      </Container>
    </Layout>
  )
}

export default ProjectPage

export async function getServerSideProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id.toUpperCase()}`
  )
  const project = await res.json()

  return {
    props: { project },
  }
}
