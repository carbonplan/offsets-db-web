import { NextResponse } from 'next/server'

function constructUrl(req) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const reqUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
  searchParams.delete('path')
  reqUrl.search = searchParams.toString()

  return reqUrl
}

export const runtime = 'edge' // 'nodejs' is the default

export default async function handler(req) {
  try {
    const reqUrl = constructUrl(req)
    const serverRes = await fetch(reqUrl, {
      headers: { 'X-API-KEY': process.env.API_KEY },
    })
    if (!serverRes.ok) {
      throw new Error(
        `API request failed: ${serverRes.status} ${serverRes.statusText}`
      )
    }
    const result = await serverRes.json()
    const res = NextResponse.json(result, {
      headers: new Headers([['Cache-Control', 'public, s-maxage=604800']]), // 7 days
    })
    return res
  } catch (e) {
    console.log('ERR', e.message)
    NextResponse.status(400).send({ error: e.message })
  }
}
