const slug = require('rehype-slug')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [slug],
    format: 'mdx',
  },
})

module.exports = withMDX({
  pageExtensions: ['jsx', 'js', 'md', 'mdx'],
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
