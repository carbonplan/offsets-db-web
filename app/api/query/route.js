import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const params = req.nextUrl.searchParams
    const path = params.get('path')
    params.delete('path')

    const reqUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    reqUrl.search = params.toString()
    const serverRes = await fetch(reqUrl, {
      headers: { 'X-API-KEY': process.env.API_KEY },
    })
    if (!serverRes.ok) {
      throw new Error(
        `API request failed: ${serverRes.status} ${serverRes.statusText}`
      )
    }
    const result = await serverRes.json()
    return NextResponse.json({
      terms:
        'https://offsets-db-data.readthedocs.io/en/latest/TERMS-OF-DATA-ACCESS.html',
      ...result,
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
