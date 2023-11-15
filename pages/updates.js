import { Column, Layout as PageLayout, Row } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Container, Flex } from 'theme-ui'
import BackButton from '../components/back-button'

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
        <Row sx={{ mt: [5, 6, 7, 8], mb: [5, 6, 7, 8] }}>
          <Column start={1} width={[6, 1, 1, 1]}>
            <Flex sx={{ height: '100%', alignItems: 'flex-end' }}>
              <BackButton sx={{ mb: [3, '4px', '6px', '6px'] }} />
            </Flex>
          </Column>
          <Column start={[1, 2, 2, 3]} width={[6, 6, 6, 5]}>
            <Box as='h1' variant='styles.h1' sx={{ my: [0, 0, 0, 0] }}>
              Offsets DB — Updates
            </Box>
          </Column>
          <Column start={[1, 2, 8, 8]} width={[5, 6, 5, 4]}>
            <Box
              sx={{
                mt: [4, 5, '20px', '31px'],
                fontSize: [2, 2, 2, 3],
              }}
            >
              A regularly updating list of stories and press events related to
              offset projects in the database.
            </Box>
          </Column>
        </Row>

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
