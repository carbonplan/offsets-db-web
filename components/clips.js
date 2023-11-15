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
    <Row sx={{ mt: 4 }}>
      {sortedEntries.length === 0 && (
        <Column start={1} width={[4, 4, 2, 2]}>
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
      )}
      {sortedEntries.map(({ date, label, url, projects }, i) => {
        const left = i % 2 === 0
        return (
          <Column
            key={label}
            start={left ? 3 : 8}
            width={[4, 4, 3, 3]}
            sx={{
              mt: 3,
              mb: 2,
              background: 'muted',
              py: 4,
              mx: [-4, -5, -5, -6],
              px: [4, 5, 5, 6],
            }}
          >
            <Row
              columns={[4, 4, 2, 2]}
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
              <Column
                start={1}
                width={[4, 4, 2, 2]}
                sx={{ position: 'relative' }}
              >
                <Box
                  as='svg'
                  width='12'
                  height='12'
                  viewBox='0 0 13 13'
                  fill='none'
                  sx={{
                    position: 'absolute',
                    mt: '3px',
                    ml: [
                      `calc(-7.25px - (24px + (100vw - 7 * 24px) / 6 / 2))`,
                      `calc(-7px - (32px + (100vw - 9 * 32px) / 8 / 2))`,
                      `calc(-6.25px - (32px + (100vw - 13 * 32px) / 12 / 2))`,
                      `calc(-6.25px - (48px + (100vw - 13 * 48px) / 12 / 2))`,
                    ],
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

                {date && formatDate(date)}
              </Column>
            </Row>
            {url ? (
              <Button href={url} suffix={<RotatingArrow />} size='xs'>
                {label}
              </Button>
            ) : (
              label
            )}

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
        )
      })}
    </Row>
  )
}

export default Clips
