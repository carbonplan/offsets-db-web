import useSWR from 'swr'

import { useQueries } from './queries'
import { useDebounce } from './utils'

function escapeUnicode(str) {
  return str.replace(/[\s\S]/g, (char) => {
    const code = char.charCodeAt(0)
    return code > 127 ? `\\\\u${code.toString(16).padStart(4, '0')}` : char
  })
}

const fetcher = ([
  path,
  creditType,
  transactionType,
  project_id,
  sort,
  page,
  binWidth,
  registry,
  category,
  projectType,
  complianceOnly,
  search,
  listingBounds,
  transactionBounds,
  issuedBounds,
  countries,
  protocols,
  beneficiarySearch,
]) => {
  const params = new URLSearchParams()
  params.append('path', path)
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
    params.append('per_page', 100)
  }

  if (binWidth) {
    params.append('bin_width', binWidth)
  }

  if (registry) {
    const registries = Object.keys(registry).filter((r) => registry[r])
    if (registries.length === 0) {
      params.append('registry', 'none')
    } else {
      registries.forEach((r) => params.append('registry', r))
    }
  }

  if (category) {
    const categories = Object.keys(category).filter((c) => category[c])

    if (categories.length === 0) {
      params.append('category', 'none')
    } else {
      categories.forEach((c) => params.append('category', c))
    }
  }

  if (projectType) {
    if (projectType.length === 0) {
      params.append('project_type', 'none')
    } else {
      projectType.forEach((t) =>
        params.append('project_type', escapeUnicode(t))
      )
    }
  }

  if (search?.trim()) {
    params.append('search', search.trim())
  }

  if (beneficiarySearch?.trim()) {
    params.append('beneficiary_search', beneficiarySearch.trim())
    params.append(
      'beneficiary_search_fields',
      'retirement_beneficiary_harmonized'
    )
    params.append('beneficiary_search_fields', 'retirement_account')
    params.append('beneficiary_search_fields', 'retirement_beneficiary')
    params.append('beneficiary_search_fields', 'retirement_note')
    params.append('beneficiary_search_fields', 'retirement_reason')
  }

  if (typeof complianceOnly === 'boolean') {
    params.append('is_compliance', complianceOnly)
  }

  if (listingBounds) {
    params.append('listed_at_from', `${listingBounds[0]}-01-01`)
    params.append('listed_at_to', `${listingBounds[1]}-12-31`)
  }

  if (transactionBounds) {
    params.append('transaction_date_from', `${transactionBounds[0]}-01-01`)
    params.append('transaction_date_to', `${transactionBounds[1]}-12-31`)
  }

  if (issuedBounds) {
    params.append('issued_min', issuedBounds[0])
    params.append('issued_max', issuedBounds[1])
  }

  if (countries) {
    countries.forEach((country) => params.append('country', country))
  }

  if (protocols) {
    protocols.forEach((protocol) => params.append('protocol', protocol))
  }

  const reqUrl = new URL(
    '/research/offsets-db/api/query',
    window.location.origin
  )
  reqUrl.search = params.toString()

  return fetch(reqUrl)
    .then((r) => r.json())
    .then((r) => {
      if (!r || !r.data) {
        throw new Error(r?.error ?? r?.detail ?? 'Not found')
      }
      return r
    })
}

const useFetcher = (
  path,
  {
    creditType,
    transactionType,
    project_id,
    filters = true,
    sort,
    page,
    binWidth,
  }
) => {
  const {
    registry,
    category,
    projectType,
    complianceOnly,
    search,
    listingBounds,
    transactionBounds,
    issuedBounds,
    countries,
    protocols,
    beneficiarySearch,
  } = useQueries()

  const filterArgs = [
    useDebounce(registry),
    useDebounce(category),
    useDebounce(projectType),
    complianceOnly,
    useDebounce(search),
    useDebounce(listingBounds),
    useDebounce(transactionBounds),
    useDebounce(issuedBounds),
    countries,
    protocols,
    useDebounce(beneficiarySearch),
  ]

  return useSWR(
    [
      path,
      creditType,
      transactionType,
      project_id,
      sort,
      page,
      binWidth,
      ...(filters ? filterArgs : []),
    ],
    fetcher,
    { revalidateOnFocus: false, revalidateIfStale: false }
  )
}

export default useFetcher
