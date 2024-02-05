import { Layout } from '@carbonplan/components'
import { useRouter } from 'next/router'
import { Container } from 'theme-ui'
import useSWR from 'swr'
import { useEffect } from 'react'

import Project from '../../../../components/project'

const fetcher = ([id]) => {
  if (!id) {
    return
  }

  const params = new URLSearchParams()
  params.append('path', `projects/${id?.toUpperCase()}`)

  const reqUrl = new URL('/api/query', window.location.origin)
  reqUrl.search = params.toString()

  return fetch(reqUrl)
    .then((r) => r.json())
    .then((r) => {
      if (r.error) {
        throw new Error(r.error)
      }
      return r
    })
}

const ProjectPage = () => {
  const router = useRouter()
  const { data, error, isFetching } = useSWR(
    [router.query.id?.toUpperCase()],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (error) {
      router.push('/404')
    }
  }, [error])

  let content
  if (data?.project_id) {
    content = <Project project={data} />
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
