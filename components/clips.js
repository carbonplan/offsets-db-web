import { Column, Row, formatDate, Button, Badge } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { useMemo } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import { COLORS } from './constants'

const Clips = ({ clips }) => {
  const { theme } = useThemeUI()

  const sortedEntries = useMemo(
    () =>
      [
        ...clips.map(({ date, title, url, projects }) => ({
          date: date.match(/\d{4}-\d{2}-\d{2}/)[0],
          label: title,
          url,
          projects,
        })),
      ]
        .filter((d) => d.date)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [clips]
  )

  return (
    <Box sx={{ mt: 4 }}>
      {sortedEntries.length === 0 && (
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
      )}
      {sortedEntries.map(({ date, label, url, projects }, i) => {
        const left = i % 2 === 0
        return (
          <Row key={label}>
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
              <Row
                columns={[4, 3, 3, 3]}
                sx={{
                  color: 'secondary',
                  fontFamily: 'mono',
                  letterSpacing: '0.05em',
                  fontSize: [1, 1, 1, 2],
                  userSelect: 'none',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  mb: 3,
                }}
              >
                <Column start={1} width={[4, 3, 3, 3]}>
                  {date && formatDate(date)}
                </Column>
              </Row>

              <Box sx={{ mb: 3 }}>
                {url ? (
                  <Button href={url} suffix={<RotatingArrow />} size='xs'>
                    {label}
                  </Button>
                ) : (
                  label
                )}
              </Box>

              <Flex sx={{ gap: 2 }}>
                {projects?.map(({ project_id, category }) => (
                  <Badge
                    key={project_id}
                    sx={{ color: COLORS[category[0]], mt: 3 }}
                  >
                    {project_id}
                  </Badge>
                ))}
              </Flex>
            </Column>

            <Column
              start={[1, 5, 7, 7]}
              width={1}
              sx={{ mt: 3, pt: 4, order: left ? [0, 1, 1, 1] : 0 }}
            >
              <Box
                as='svg'
                viewBox='0 0 13 13'
                fill='none'
                sx={{
                  ml: [0, -32 + 5, -32 + 5, -48 + 5],
                  width: [24 - 10, 32 - 10, 32 - 10, 48 - 10],
                }}
              >
                <circle
                  cx='6.5'
                  cy='6.5'
                  r='6'
                  fill={theme.colors.background}
                  stroke={theme.colors.secondary}
                />
              </Box>
            </Column>
          </Row>
        )
      })}
    </Box>
  )
}

export default Clips
