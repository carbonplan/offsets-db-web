const slug = require('rehype-slug')

const isDev =
  process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [slug],
    format: 'mdx',
  },
})

module.exports = withMDX({
  pageExtensions: ['jsx', 'js', 'md', 'mdx'],
  assetPrefix: isDev ? '' : 'https://offsets-db.carbonplan.org',
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/research/offsets-db',
        permanent: true,
      },
    ]
  },
})
