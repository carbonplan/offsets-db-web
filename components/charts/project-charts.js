import { Row, Column } from '@carbonplan/components'
import { useMemo, useState } from 'react'
import AnimateHeight from 'react-animate-height'

import { LABELS } from '../constants'
import useFetcher from '../use-fetcher'
import CategoryBar from './category-bar'
import DetailCharts from './detail-charts'
import { useQueries } from '../queries'

const EMPTY = {
  issued: { total: 0, mapping: {} },
  retired: { total: 0, mapping: {} },
}

const ProjectCharts = () => {
  const [expanded, setExpanded] = useState(false)
  const { data, error, isLoading } = useFetcher(
    'charts/credits_by_category',
    {}
  )
  const { beneficiarySearch } = useQueries()

  const { issued: initialIssued, retired } = useMemo(() => {
    if (!data) {
      return EMPTY
    }

    return data.data.reduce(
      (
        { issued: prevIssued, retired: prevRetired },
        { category, retired, issued }
      ) => {
        const key = LABELS.category[category] ? category : 'other'
        return {
          issued: {
            total: prevIssued.total + issued,
            mapping: {
              ...prevIssued.mapping,
              [key]: prevIssued.mapping[key]
                ? prevIssued.mapping[key] + issued
                : issued,
            },
          },
          retired: {
            total: prevRetired.total + retired,
            mapping: {
              ...prevRetired.mapping,
              [key]: prevRetired.mapping[key]
                ? prevRetired.mapping[key] + retired
                : retired,
            },
            issuedTotal: prevIssued.total + issued,
          },
        }
      },
      EMPTY
    )
  }, [data])

  const issuedKeys = Object.keys(initialIssued.mapping)
  const issued = beneficiarySearch ? EMPTY.issued : initialIssued
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
