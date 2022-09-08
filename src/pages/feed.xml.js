import rss from '@astrojs/rss'
import { Posts } from '../posts'

const posts = await Posts()

export const get = () => rss({
  title: 'Dom Christie',
  description: 'Born in Denmark. Grew up in London. Live in L.A.',
  site: import.meta.env.SITE,
  items: posts.map((post) => ({
    link: post.url,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
  }))
});
