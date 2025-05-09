import {
  Column,
  Row,
  formatDate,
  Button,
  Tag,
  Expander,
} from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { useMemo, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { Box, Flex, useThemeUI } from 'theme-ui'
import ProjectBadge from './project-badge'
import { getProjectCategory } from './utils'

// 10px less than column gutter widths
const CIRCLE_WIDTHS = [24 - 10, 32 - 10, 32 - 10, 48 - 10]

const ClipText = ({ projects, children }) => {
  const content = useMemo(() => {
    if (typeof children === 'string') {
      const ids = projects.map((p) => p.project_id)
      const categories = projects.reduce((a, p) => {
        a[p.project_id] = getProjectCategory(p)
        return a
      }, {})

      const regex = new RegExp(`(${ids.join('|')})`, 'gi')

      return children
        .split(regex)
        .map((part) =>
          ids.includes(part) ? (
            <ProjectBadge
              project={{ project_id: part, category: [categories[part]] }}
              link
            />
          ) : (
            part
          )
        )
    }

    return children
  }, [children, projects])

  return (
    <Box as='span' sx={{ fontSize: [2, 2, 2, 3] }}>
      {content}
    </Box>
  )
}

const Clip = ({ date, label, url, projects, source, index }) => {
  const { theme } = useThemeUI()
  const [expanded, setExpanded] = useState(
    projects.length <= 5 && projects.some((p) => !label.includes(p.project_id))
  )
  const left = index % 2 === 0

  return (
    <Row sx={{ mt: index > 0 ? [0, -6, -6, -6] : 0 }}>
      <Column
        start={left ? [2, 1, 3, 3] : [2, 6, 8, 8]}
        width={[4, 3, 3, 3]}
        sx={{
          mt: 3,
          mb: 2,
          background: 'muted',
          py: 4,
          mx: [-4, -5, -5, -6],
          px: [4, 5, 5, 6],
          order: left ? [1, 0, 0, 0] : 1,
        }}
      >
        <Flex sx={{ mb: 4, justifyContent: 'space-between' }}>
          <Box
            sx={{
              color: 'secondary',
              fontFamily: 'mono',
              letterSpacing: '0.05em',
              fontSize: [1, 1, 1, 2],
              userSelect: 'none',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {date && formatDate(date)}
          </Box>
          {source && 'offsets-db' !== source && (
            <Box
              sx={{ textAlign: 'right', mt: ['-8px', '-8px', '-4px', '-3px'] }}
            >
              <Tag
                sx={{
                  lineHeight: 1.8,
                  display: 'initial',
                  width: 'fit-content',
                }}
              >
                {source}
              </Tag>
            </Box>
          )}
        </Flex>

        <Box sx={{ mb: 4 }}>
          {url ? (
            <Button href={url} suffix={<RotatingArrow />} size='xs'>
              {label}
            </Button>
          ) : (
            <ClipText projects={projects}>{label}</ClipText>
          )}
        </Box>

        {projects.length > 5 && (
          <Box
            as={'label'}
            sx={{
              cursor: 'pointer',
              userSelect: 'none',
              fontFamily: 'mono',
              letterSpacing: 'mono',
              textTransform: 'uppercase',
              fontSize: 1,
            }}
          >
            <Box as='span' sx={{ mr: 1 }}>
              {projects.length} projects
            </Box>
            <Expander
              value={expanded}
              onClick={() => setExpanded(!expanded)}
              sx={{
                mt: '-2px',
                width: '18px',
                height: '18px',
              }}
            />
          </Box>
        )}
        <AnimateHeight
          duration={100}
          height={expanded ? 'auto' : 0}
          easing={'linear'}
        >
          {expanded && (
            <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 3 }}>
              {projects?.map((project) => (
                <ProjectBadge project={project} key={project.project_id} link />
              ))}
            </Flex>
          )}
        </AnimateHeight>
      </Column>

      <Column
        start={[1, left ? 4 : 5, left ? 6 : 7, left ? 6 : 7]}
        width={[1]}
        sx={{
          borderColor: 'secondary',
          borderWidth: 0,
          borderTopWidth: 1,
          borderStyle: 'solid',
          mt: 46,
          [left ? 'mr' : 'ml']: [0, -16, -16, -24],
          [left ? 'pr' : 'pl']: [0, 16, 16, 24],
          order: left ? [0, 1, 1, 1] : 0,
        }}
      >
        <Flex
          sx={{
            justifyContent: [
              'flex-start',
              left ? 'flex-end' : 'flex-start',
              left ? 'flex-end' : 'flex-start',
              left ? 'flex-end' : 'flex-start',
            ],
          }}
        >
          <Box
            sx={{
              width: CIRCLE_WIDTHS,
              [left ? 'mr' : 'ml']: [0, -32 + 5, -32 + 5, -48 + 5],
              mt: CIRCLE_WIDTHS.map((d, i) =>
                i === 0 ? '-10px' : `${(d * -1) / 2}px`
              ),
            }}
          >
            <Box
              as='svg'
              width='100%'
              height='100%'
              viewBox='0 0 13 13'
              fill='none'
              sx={{ strokeWidth: '1px' }}
            >
              <circle
                cx='6.5'
                cy='6.5'
                r='6'
                fill={theme.colors.background}
                stroke={theme.colors.secondary}
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </Box>
          </Box>
        </Flex>
      </Column>
    </Row>
  )
}

const Clips = ({ clips }) => {
  const sortedEntries = useMemo(
    () =>
      [
        ...clips.map(({ date, title, url, projects, source }) => ({
          date: date.match(/\d{4}-\d{2}-\d{2}/)[0],
          label: title,
          url,
          projects,
          source,
        })),
      ]
        .filter((d) => d.date)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [clips]
  )

  return (
    <Box sx={{ mt: 4, position: 'relative' }}>
      {sortedEntries.length === 0 ? (
        <Row>
          <Column start={[1, 2, 2, 2]} width={[4, 4, 2, 2]}>
            <Box
              sx={{
                mt: 3,
                color: 'secondary',
                fontFamily: 'mono',
                letterSpacing: 'mono',
                textTransform: 'uppercase',
              }}
            >
              No events
            </Box>
          </Column>
        </Row>
      ) : (
        <Box
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            width: [CIRCLE_WIDTHS[0] / 2, '50%', '50%', '50%'],
            height: '100%',
            top: [0, 0, -100, -100],
            borderColor: 'secondary',
            borderWidth: 0,
            borderRightWidth: 1,
            borderStyle: 'solid',
            zIndex: -1,
          }}
        />
      )}

      {sortedEntries.map(({ date, label, ...entry }, i) => (
        <Clip
          key={`${label}-${date}`}
          date={date}
          label={label}
          {...entry}
          index={i}
        />
      ))}
    </Box>
  )
}

export default Clips
