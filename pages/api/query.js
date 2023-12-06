export default async function handler(req, res) {
  try {
    const { path, ...search } = req.query
    const reqUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    reqUrl.search = search.toString()
    const serverRes = await fetch(reqUrl)
    const result = await serverRes.json()
    res.status(200).send(result)
  } catch (e) {
    res.status(400).send({ error: 'testing' })
  }
}
