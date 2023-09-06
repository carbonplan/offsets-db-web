import { Box, Divider, useThemeUI } from 'theme-ui'
import { useMemo } from 'react'
import { Column, formatDate, Row } from '@carbonplan/components'

const Timeline = ({ project }) => {
  const { theme } = useThemeUI()
  const sortedEntries = useMemo(
    () => [
      { date: project.registered_at, label: 'Project registered' },
      { date: project.started_at, label: 'Project listed' },
    ],
    [project]
  )

  return (
    <Row columns={[6, 8, 3, 3]}>
      <Column start={2} width={[4, 4, 2, 2]}>
        <Row
          columns={[4, 4, 2, 2]}
          sx={{
            borderWidth: 0,
            borderLeft: '1px',
            borderColor: 'secondary',
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
          {sortedEntries.map(({ date, label }) => (
            <Column
              key={date}
              start={1}
              width={[4, 4, 2, 2]}
              sx={{ mt: 3, mb: 2 }}
            >
              <Divider sx={{ my: 0 }} />
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
                  mt: 3,
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
              {label}
            </Column>
          ))}
        </Row>
      </Column>
    </Row>
  )
}

export default Timeline
