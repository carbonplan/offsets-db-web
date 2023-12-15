import { Layout } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Container, Flex } from 'theme-ui'

import Project from '../../components/project'
import CustomTimeout from '../../components/custom-timeout'

const ProjectPage = ({ project, error }) => {
  const router = useRouter()

  useEffect(() => {
    if (!error && !project?.project_id) {
      router.push('/404')
    }
  }, [error, project?.project_id])

  let content
  if (error) {
    content = <CustomTimeout />
  } else if (project?.project_id) {
    content = <Project project={project} />
  }
  return (
    <Layout
      title='OffsetsDB – CarbonPlan'
      description='TK'
      card='TK'
      dimmer='top'
      footer={false}
      metadata={false}
      container={false}
      nav={'research'}
      url={'https://carbonplan.org/research/offsets-db'}
    >
      <Container>{content}</Container>
    </Layout>
  )
}

export default ProjectPage

export const maxDuration = 15 // This function can run for a maximum of 15 seconds

function withTimeout(promise, ms) {
  let timeoutId
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, ms)
  })

  return Promise.race([promise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutId)
    return result
  })
}

export const config = {
  runtime: 'edge',
}

export async function getServerSideProps({ params }) {
  try {
    const res = await withTimeout(
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/projects/${params.id.toUpperCase()}`,
        {
          headers: {
            'X-API-KEY': process.env.API_KEY,
          },
        }
      ),
      maxDuration * 1000 - 1
    )
    const project = await res.json()

    return { props: { project } }
  } catch (error) {
    return { props: { error: error.message } }
  }
}
