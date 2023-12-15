import { Row, Column, Expander } from '@carbonplan/components'
import { useMemo, useState } from 'react'
import AnimateHeight from 'react-animate-height'

import { LABELS } from '../constants'
import useFetcher from '../use-fetcher'
import CategoryBar from './category-bar'
import DetailCharts from './detail-charts'

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
            issuedTotal: prevIssued.total + issued,
          },
        }
      },
      empty
    )
  }, [data])

  return (
    <Row
      columns={1}
      onClick={() => setExpanded(!expanded)}
      sx={{
        '&:hover #expander': {
          stroke: 'primary',
        },
        cursor: 'pointer',
        mt: 5,
        color: 'primary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        textTransform: 'uppercase',
      }}
    >
      <Column start={1}>
        <CategoryBar
          label='Credits issued'
          {...issued}
          expanded={expanded}
          showExpander
        />
        <CategoryBar label='Credits retired' {...retired} expanded={expanded} />
        <AnimateHeight
          duration={100}
          height={expanded ? 'auto' : 0}
          easing={'linear'}
        >
          <DetailCharts
            retired={retired}
            issued={issued}
            isLoading={isLoading}
            error={error}
          />
        </AnimateHeight>
      </Column>
    </Row>
  )
}

export default ProjectCharts
