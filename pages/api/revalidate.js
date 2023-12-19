import { revalidatePath } from 'next/cache'
import { LRUCache } from 'lru-cache'

// Based on https://github.com/vercel/next.js/tree/canary/examples/api-routes-rate-limit
function rateLimit(options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (res, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit
        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage
        )

        return isRateLimited ? reject() : resolve()
      }),
  }
}

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 10, // Max 10 users per second
})

export default async function handler(req, res) {
  try {
    await limiter.check(res, 10, 'CACHE_TOKEN')
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' })
    return
  }

  if (!req.headers['x-api-key']) {
    res.status(403).send({ error: 'Please provide X-API-KEY' })
    return
  }

  // TODO: should we setup specific revalidate key?
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    res.status(403).send({ error: 'Please provide correct X-API-KEY' })
    return
  }

  try {
    res.revalidate('/api/query')
    res.revalidate('/projects/[id]')
    res.status(200).send({ revalidated: true })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}
