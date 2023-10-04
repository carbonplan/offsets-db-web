import useSWR from 'swr'

import { useQueries } from './queries'
import { useDebounce } from './utils'

const fetcher = ([
  url,
  creditType,
  transactionType,
  project_id,
  sort,
  page,
  registry = {},
  category = {},
  complianceOnly,
  search,
  registrationBounds,
  issuedBounds,
  countries,
]) => {
  const params = new URLSearchParams()
  if (creditType) {
    params.append('credit_type', creditType)
  }

  if (transactionType) {
    params.append('transaction_type', transactionType)
  }

  if (project_id) {
    params.append('project_id', project_id)
  }

  if (sort) {
    params.append('sort', sort)
  }

  if (page) {
    params.append('current_page', page)
    params.append('per_page', 25)
  }

  Object.keys(registry)
    .filter((r) => registry[r])
    .forEach((r) => params.append('registry', r))

  Object.keys(category)
    .filter((c) => category[c])
    .forEach((c) => params.append('category', c))

  if (search?.trim()) {
    params.append('search', search.trim())
  }

  if (complianceOnly) {
    params.append('is_arb', complianceOnly)
  }

  if (registrationBounds) {
    params.append('registered_at_from', `${registrationBounds[0]}-01-01`)
    params.append('registered_at_to', `${registrationBounds[1]}-12-31`)
  }

  if (issuedBounds) {
    params.append('issued_min', issuedBounds[0])
    params.append('issued_max', issuedBounds[1])
  }

  if (countries) {
    countries.forEach((country) => params.append('country', country))
  }

  const reqUrl = new URL(url)
  reqUrl.search = params.toString()

  return fetch(reqUrl).then((r) => r.json())
}

const useFetcher = (
  path,
  { creditType, transactionType, project_id, filters = true, sort, page }
) => {
  const {
    registry,
    category,
    complianceOnly,
    search,
    registrationBounds,
    issuedBounds,
    countries,
  } = useQueries()

  const filterArgs = [
    useDebounce(registry),
    useDebounce(category),
    complianceOnly,
    useDebounce(search),
    useDebounce(registrationBounds),
    useDebounce(issuedBounds),
    countries,
  ]

  return useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/${path}`,
      creditType,
      transactionType,
      project_id,
      useDebounce(sort, 10),
      page,
      ...(filters ? filterArgs : []),
    ],
    fetcher,
    { revalidateOnFocus: false }
  )
}

export default useFetcher
