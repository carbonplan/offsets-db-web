import { Column, Row } from '@carbonplan/components'
import { useMemo, useState } from 'react'

import { LABELS } from '../constants'
import useFetcher from '../use-fetcher'
import CategoryBar from './category-bar'

const ProjectCharts = () => {
  const [expanded, setExpanded] = useState(false)
  const { data, error, isLoading } = useFetcher(
    'charts/credits_by_category',
    {}
  )

  const { issued, retired } = useMemo(() => {
    const empty = {
      issued: { total: 0, mapping: {} },
      retired: { total: 0, mapping: {} },
    }
    if (!data) {
      return empty
    }

    return data.data.reduce(
      (
        { issued: prevIssued, retired: prevRetired },
        { category, retired, issued }
      ) => {
        const key = LABELS.category[category] ? category : 'other'
        prevIssued.mapping[key] = prevIssued.mapping[key]
          ? prevIssued.mapping[key] + issued
          : issued
        prevRetired.mapping[key] = prevRetired.mapping[key]
          ? prevRetired.mapping[key] + retired
          : retired
        return {
          issued: {
            total: prevIssued.total + issued,
            mapping: prevIssued.mapping,
          },
          retired: {
            total: prevRetired.total + retired,
            mapping: prevRetired.mapping,
          },
        }
      },
      empty
    )
  }, [data])

  return (
    <Row
      onClick={() => setExpanded(!expanded)}
      columns={[6, 8, 8, 8]}
      sx={{
        color: 'primary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        textTransform: 'uppercase',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-1px)',
          transition: 'transform 0.3s ease',
        },
        transform: 'none',
        transition: 'transform 0.3s ease',
      }}
    >
      <Column start={1} width={[6, 4, 4, 4]}>
        <CategoryBar
          label='Credits issued'
          {...issued}
          expanded={expanded}
          showExpander={true}
        />
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
        <CategoryBar label='Credits retired' {...retired} expanded={expanded} />
      </Column>
    </Row>
  )
}

export default ProjectCharts
