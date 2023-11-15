import {
  Badge,
  Column,
  Heading,
  Layout as PageLayout,
  Link,
  Row,
} from '@carbonplan/components'
import { useState } from 'react'
import { Container, Flex } from 'theme-ui'

import Clips from '../components/clips'
import Pagination from '../components/pagination'
import useFetcher from '../components/use-fetcher'

const Project = () => {
  const [page, setPage] = useState(1)
  const { data } = useFetcher('clips/', {
    filters: false,
    page,
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

        {data && (
          <Row>
            <Column
              start={1}
              width={[6, 8, 10, 10]}
              sx={{ mr: [0, 0, -5, -6] }}
            >
              <Flex sx={{ my: 4, justifyContent: 'flex-end' }}>
                <Pagination pagination={data.pagination} setPage={setPage} />
              </Flex>
            </Column>
          </Row>
        )}
      </Container>
    </PageLayout>
  )
}

export default Project
