import rss from '@astrojs/rss'
import { Posts } from '../posts'

const posts = await Posts()

export const get = () => rss({
  title: 'Dom Christie',
  description: 'UK-based design engineer specialising in Ruby on Rails, JavaScript, and Web Audio.',
  site: import.meta.env.SITE,
  items: posts.map((post) => ({
    link: post.url,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
    description: post.compiledContent()
  }))
});
