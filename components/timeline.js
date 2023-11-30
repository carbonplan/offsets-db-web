import { Column, Row, formatDate, Button } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { useMemo } from 'react'
import { Box, Divider, useThemeUI } from 'theme-ui'

const Timeline = ({ project, color }) => {
  const { theme } = useThemeUI()

  const sortedEntries = useMemo(
    () =>
      [
        ...project.clips.map(({ date, title, url }) => ({
          date: date.match(/\d{4}-\d{2}-\d{2}/)[0],
          label: title,
          url,
        })),
        { date: project.first_retirement_at, label: 'First credits retired' },
        { date: project.first_issuance_at, label: 'First credits issued' },
        { date: project.listed_at, label: 'Project listed' },
      ]
        .filter((d) => d.date)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [project]
  )

  return (
    <Row columns={[6, 8, 3, 3]} sx={{ mt: 4 }}>
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
      <Column start={2} width={[4, 4, 2, 2]}>
        <Row
          columns={[4, 4, 2, 2]}
          sx={{
            borderWidth: 0,
            borderLeft: '1px',
            borderColor: color,
            borderStyle: 'solid',
            ml: [
              `calc(-1 * (24px + (100vw - 7 * 24px) / 6 / 2))`,
              `calc(-1 * (32px + (100vw - 9 * 32px) / 8 / 2))`,
              `calc(-1 * (32px + (100vw - 13 * 32px) / 12 / 2))`,
              `calc(-1 * (48px + (100vw - 13 * 48px) / 12 / 2))`,
            ],
            pl: [
              `calc((24px + (100vw - 7 * 24px) / 6 / 2))`,
              `calc((32px + (100vw - 9 * 32px) / 8 / 2))`,
              `calc((32px + (100vw - 13 * 32px) / 12 / 2))`,
              `calc((48px + (100vw - 13 * 48px) / 12 / 2))`,
            ],
          }}
        >
          {sortedEntries.map(({ date, label, url }) => (
            <Column
              key={label}
              start={1}
              width={[4, 4, 2, 2]}
              sx={{ mt: 3, mb: 2 }}
            >
              <Row
                columns={[4, 4, 2, 2]}
                sx={{
                  color,
                  fontFamily: 'mono',
                  letterSpacing: '0.05em',
                  fontSize: [1, 1, 1, 2],
                  userSelect: 'none',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  mt: 3,
                  mb: 3,
                }}
              >
                <Column start={1} width={1} sx={{ position: 'relative' }}>
                  <Divider
                    sx={{
                      top: 2,
                      position: 'absolute',
                      my: 0,
                      borderColor: color,
                      width: '50%',
                      left: '-50%',
                      ml: [-4, -5, -5, -6],
                    }}
                  />
                </Column>
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
                      stroke={theme.colors[color]}
                      style={{ vectorEffect: 'non-scaling-stroke' }}
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
            </Column>
          ))}
        </Row>
      </Column>
    </Row>
  )
}

export default Timeline
