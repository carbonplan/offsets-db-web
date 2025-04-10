function constructSearch(search = {}) {
  const params = new URLSearchParams()

  Object.keys(search).forEach((key) => {
    const value = search[key]
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry))
    } else {
      params.append(key, value)
    }
  })

  return params.toString()
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*.carbonplan.org')

  try {
    const { path, ...search } = req.query
    const reqUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    reqUrl.search = constructSearch(search)
    const serverRes = await fetch(reqUrl, {
      headers: { 'X-API-KEY': process.env.API_KEY },
    })
    if (!serverRes.ok) {
      throw new Error(
        `API request failed: ${serverRes.status} ${serverRes.statusText}`
      )
    }
    const result = await serverRes.json()
    res.status(200).send({
      terms:
        'https://offsets-db-data.readthedocs.io/en/latest/TERMS-OF-DATA-ACCESS.html',
      ...result,
    })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}
