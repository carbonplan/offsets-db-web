'use client'

import { Column, Layout, Row } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Container, Flex, Spinner } from 'theme-ui'

import BackButton from '../../components/back-button'
import Clips from '../../components/clips'
import Pagination from '../../components/pagination'
import useFetcher from '../../components/use-fetcher'

const Project = () => {
  const [page, setPage] = useState(1)
  const { data, error, isLoading } = useFetcher('clips/', {
    filters: false,
    sort: '-date',
    page,
  })

  return (
    <Layout
      title='OffsetsDB – CarbonPlan'
      description='A regularly-updating list of stories and noteworthy events related to offset projects in the database.'
      card='https://images.carbonplan.org/social/offsets-db.png'
      dimmer='top'
      footer={false}
      metadata={false}
      container={false}
      nav={'research'}
      url={'https://carbonplan.org/research/offsets-db/updates'}
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
              OffsetsDB — Updates
            </Box>
          </Column>
          <Column start={[1, 2, 8, 8]} width={[5, 6, 4, 4]}>
            <Box
              sx={{
                mt: [4, 5, '20px', '31px'],
                fontSize: [2, 2, 2, 3],
              }}
            >
              A regularly-updating list of stories and noteworthy events related
              to offset projects in the database.
            </Box>
          </Column>
        </Row>

        {isLoading && (
          <Flex sx={{ width: '100%', justifyContent: 'center' }}>
            <Spinner size={32} />
          </Flex>
        )}

        {error && (
          <Row>
            <Column start={[1, 2, 2, 2]} width={[6, 7, 10, 10]}>
              <Box
                sx={{
                  color: 'secondary',
                  fontFamily: 'mono',
                  letterSpacing: 'mono',
                  textTransform: 'uppercase',
                  mb: 4,
                  mt: 2,
                }}
              >
                Error loading data{error?.message ? `: ${error?.message}` : ''}
              </Box>
            </Column>
          </Row>
        )}

        {data && <Clips clips={data.data} />}

        <Row sx={{ my: 4 }}>
          <Column
            start={[1, 6, 7, 7]}
            width={[6, 3, 4, 4]}
            sx={{ mr: [0, 0, -5, -6] }}
          >
            <Flex sx={{ justifyContent: ['flex-start', 'flex-end'] }}>
              {data && data.pagination.total_pages > 1 && (
                <Pagination pagination={data.pagination} setPage={setPage} />
              )}
            </Flex>
          </Column>
        </Row>
      </Container>
    </Layout>
  )
}

export default Project
