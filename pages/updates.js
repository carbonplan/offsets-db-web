import {
  Badge,
  Column,
  Heading,
  Layout as PageLayout,
  Link,
  Row,
} from '@carbonplan/components'
import { Box, Container, Divider, Flex } from 'theme-ui'

import Clips from '../components/clips'
import useFetcher from '../components/use-fetcher'

const Project = () => {
  const { data } = useFetcher('clips/', {
    filters: false,
  })

  return (
    <PageLayout
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
        <Heading
          description='A regularly updating list of stories and press events related to offset projects in the database.'
          descriptionStart={[1, 5, 8, 8]}
          descriptionWidth={[5, 3, 5, 4]}
          variant='h1'
        >
          Offsets DB — Updates
        </Heading>
        {data && <Clips clips={data.data} />}
      </Container>
    </PageLayout>
  )
}

export default Project
