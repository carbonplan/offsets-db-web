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
  try {
    const { path, ...search } = req.query
    const reqUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    reqUrl.search = constructSearch(search)
    const serverRes = await fetch(reqUrl)
    const result = await serverRes.json()
    res.status(200).send(result)
  } catch (e) {
    res.status(400).send({ error: 'testing' })
  }
}
