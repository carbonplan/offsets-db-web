import { Row, Column } from '@carbonplan/components'
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

  const issuedKeys = Object.keys(issued.mapping)

  return (
    <>
      <Row
        columns={[6, 8, 8, 8]}
        onClick={() => {
          if (issuedKeys.length) {
            setExpanded(!expanded)
          }
        }}
        sx={{
          '&:hover #expander': {
            stroke: 'primary',
          },
          cursor: issuedKeys.length ? 'pointer' : null,
          color: 'primary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          mt: [5, 5, 7, 7],
          mb: 3,
        }}
      >
        <Column start={1} width={[6, 4, 4, 4]}>
          <CategoryBar
            label='Credits issued'
            {...issued}
            expanded={expanded}
            showExpander={issuedKeys.length > 0}
          />
        </Column>
        <Column start={[1, 5, 5, 5]} width={[6, 4, 4, 4]}>
          <CategoryBar
            label='Credits retired'
            {...retired}
            expanded={expanded}
          />
        </Column>
      </Row>
      <Row
        columns={1}
        sx={{
          display: ['none', 'block', 'block', 'block'],
          '&:hover #expander': {
            stroke: 'primary',
          },
          color: 'primary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
        }}
      >
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
      </Row>
    </>
  )
}

export default ProjectCharts
