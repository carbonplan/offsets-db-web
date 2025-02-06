const slug = require('rehype-slug')
const { withPlausibleProxy } = require('next-plausible')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [slug],
    format: 'mdx',
  },
})

module.exports = withPlausibleProxy()(
  withMDX({
    pageExtensions: ['jsx', 'js', 'md', 'mdx'],
    basePath: '/research/offsets-db',
  })
)
