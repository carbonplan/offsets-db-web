import { formatDate } from '@carbonplan/components'
import useSWR from 'swr'
import { Box } from 'theme-ui'

const fetcher = (path) => {
  const params = new URLSearchParams()
  params.append('path', path)

  const reqUrl = new URL(
    '/research/offsets-db/api/query',
    window.location.origin
  )
  reqUrl.search = params.toString()

  return fetch(reqUrl)
    .then((r) => r.json())
    .then((r) => {
      if (!r || !r['latest-successful-db-update']?.projects?.date) {
        throw new Error(r?.error ?? r?.detail ?? 'Not found')
      }

      const d = new Date(r['latest-successful-db-update'].projects.date)
      const timestamp = formatDate(
        `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`
      )
      return timestamp
    })
}

const LastUpdated = () => {
  const {
    data: timestamp,
    error,
    isFetching,
  } = useSWR('health/database', fetcher, {
    revalidateOnFocus: false,
  })

  return (
    <Box as='span' sx={{ fontSize: 1, color: 'secondary' }}>
      {timestamp ? `Last updated ${timestamp}.` : '—'}
    </Box>
  )
}

export default LastUpdated
